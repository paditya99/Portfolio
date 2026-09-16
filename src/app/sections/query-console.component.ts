import {
  Component, signal, computed, ElementRef, inject, AfterViewInit, OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionHeaderComponent } from '../components/section-header.component';
import { ResumeService } from '../core/resume.service';
import { highlightSql, SqlToken } from '../utils/sql-highlight';
import { yearsBetween } from '../utils/duration';

interface QueryDef {
  id: string;
  label: string;
  sql: SqlToken[][];
  columns: string[];
  align: ('l' | 'r')[];
  rows: string[][];
}

@Component({
  selector: 'app-query-console',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionHeaderComponent],
  templateUrl: './query-console.component.html',
  styleUrl: './query-console.component.scss',
})
export class QueryConsoleComponent implements AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private resume = inject(ResumeService);

  readonly queries: QueryDef[] = [
    {
      id: 'experience',
      label: 'experience',
      sql: highlightSql(
        "SELECT company, role, years, stack\n" +
        "FROM   career.experience\n" +
        "ORDER  BY start_date DESC;",
      ),
      columns: ['company', 'role', 'years', 'stack'],
      align: ['l', 'l', 'r', 'l'],
      rows: this.resume.roles.map((r) => [
        r.company,
        r.title.replace(/^.*\((.*)\).*$/, '$1'),
        yearsBetween(r.from, r.to),
        r.stack.slice(0, 3).join(', '),
      ]),
    },
    {
      id: 'projects',
      label: 'projects',
      sql: highlightSql(
        "SELECT name, type, tech\n" +
        "FROM   career.projects\n" +
        "ORDER  BY featured DESC;",
      ),
      columns: ['name', 'type', 'tech'],
      align: ['l', 'l', 'l'],
      rows: this.resume.projects.map((p) => [p.name, p.kind, p.tags.slice(0, 3).join(', ')]),
    },
    {
      id: 'ai',
      label: 'ai',
      sql: highlightSql(
        "SELECT technique, level\n" +
        "FROM   career.skills\n" +
        "WHERE  category = 'AI/LLM';",
      ),
      columns: ['technique', 'level'],
      align: ['l', 'l'],
      rows: (this.resume.skills.find((g) => g.short === 'AI/LLM')?.items ?? [])
        .map((s) => [s.name, s.meta]),
    },
    {
      id: 'tech',
      label: 'tech',
      sql: highlightSql(
        "SELECT tech, COUNT(*) AS projects\n" +
        "FROM   career.project_tags\n" +
        "GROUP  BY tech\n" +
        "HAVING COUNT(*) > 1\n" +
        "ORDER  BY projects DESC;",
      ),
      columns: ['tech', 'projects'],
      align: ['l', 'r'],
      rows: (() => {
        const tally = new Map<string, number>();
        for (const p of this.resume.projects) {
          for (const t of p.tags) tally.set(t, (tally.get(t) ?? 0) + 1);
        }
        return [...tally.entries()]
          .filter(([, n]) => n > 1)
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          .map(([t, n]) => [t, String(n)]);
      })(),
    },
    {
      id: 'education',
      label: 'education',
      sql: highlightSql(
        "SELECT school, qualification, score\n" +
        "FROM   career.education\n" +
        "ORDER  BY completed DESC;",
      ),
      columns: ['school', 'qualification', 'score'],
      align: ['l', 'l', 'r'],
      rows: this.resume.education.map((e) => [e.school, e.detail, e.score]),
    },
    {
      id: 'stack',
      label: 'stack',
      sql: highlightSql(
        "SELECT category, COUNT(*) AS skills\n" +
        "FROM   career.skills\n" +
        "GROUP  BY category\n" +
        "ORDER  BY skills DESC;",
      ),
      columns: ['category', 'skills'],
      align: ['l', 'r'],
      rows: this.resume.skills
        .map((g) => [g.short, String(g.items.length)])
        .sort((a, b) => Number(b[1]) - Number(a[1])),
    },
  ];

  readonly active = signal(0);
  readonly running = signal(false);
  readonly ms = signal('0.6');
  readonly q = computed(() => this.queries[this.active()]);

  /** How many characters of the active query have been "typed" so far. */
  readonly typed = signal(0);
  readonly isTyping = computed(() => this.typed() < this.totalChars(this.q()));

  /**
   * The active SQL trimmed to `typed` characters, so the editor types itself
   * out when a tab is selected. Every line is emitted even when empty, which
   * keeps the gutter line numbers from reflowing mid-animation.
   */
  readonly visibleSql = computed<SqlToken[][]>(() => {
    const q = this.q();
    let budget = this.typed();
    if (budget >= this.totalChars(q)) return q.sql;
    return q.sql.map((line) => {
      const out: SqlToken[] = [];
      for (const t of line) {
        if (budget <= 0) break;
        out.push(budget >= t.t.length ? t : { ...t, t: t.t.slice(0, budget) });
        budget -= t.t.length;
      }
      return out;
    });
  });

  /** Index of the line the caret sits on — the last one with characters yet. */
  readonly caretLine = computed(() => {
    const lines = this.visibleSql();
    for (let i = lines.length - 1; i >= 0; i--) if (lines[i].length) return i;
    return 0;
  });

  private timer?: ReturnType<typeof setTimeout>;
  private typeTimer?: ReturnType<typeof setInterval>;
  private observer?: IntersectionObserver;
  private hasAutoRun = false;

  private totalChars(q: QueryDef): number {
    return q.sql.reduce((n, line) => n + line.reduce((m, t) => m + t.t.length, 0), 0);
  }

  /** Types the active query out, then hands off to `run()`. */
  private typeThenRun(): void {
    clearInterval(this.typeTimer);
    const total = this.totalChars(this.q());
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.typed.set(total);
      this.run();
      return;
    }
    this.typed.set(0);
    const step = Math.max(1, Math.ceil(total / 42)); // ~42 frames, whatever the length
    this.typeTimer = setInterval(() => {
      const next = this.typed() + step;
      if (next >= total) {
        clearInterval(this.typeTimer);
        this.typed.set(total);
        this.run();
      } else {
        this.typed.set(next);
      }
    }, 18);
  }

  select(i: number): void {
    this.active.set(i);
    this.typeThenRun();
  }

  run(): void {
    clearTimeout(this.timer);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.ms.set((0.4 + Math.random() * 1.5).toFixed(1));
    if (reduce) { this.running.set(false); return; }
    this.running.set(true);
    this.timer = setTimeout(() => this.running.set(false), 430);
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !this.hasAutoRun) {
            this.hasAutoRun = true;
            this.typeThenRun();
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    clearInterval(this.typeTimer);
    this.observer?.disconnect();
  }
}
