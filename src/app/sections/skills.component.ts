import {
  Component, signal, computed, ElementRef, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionHeaderComponent } from '../components/section-header.component';
import { ResumeService } from '../core/resume.service';
import { SkillKind } from '../data/resume';

interface Row {
  name: string; meta: string; note: string;
  group: string; kind: SkillKind; glyph: string; kindLabel: string;
  hay: string; // lowercased search haystack
  url?: string; // official docs, when the term has a canonical home
}

/** A row's name split around the current query, so the match can be marked. */
export interface NamePart { t: string; hit: boolean; }

const KIND: Record<SkillKind, { glyph: string; label: string }> = {
  method:    { glyph: 'M', label: 'method' },
  class:     { glyph: 'C', label: 'class' },
  field:     { glyph: 'F', label: 'field' },
  variable:  { glyph: 'V', label: 'variable' },
  interface: { glyph: 'I', label: 'interface' },
  event:     { glyph: 'E', label: 'event' },
  snippet:   { glyph: 'S', label: 'snippet' },
};

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective, SectionHeaderComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  private host = inject(ElementRef<HTMLElement>);
  private resume = inject(ResumeService);

  readonly rows: Row[] = this.resume.skills.flatMap((g) =>
    g.items.map((it) => ({
      ...it,
      group: g.group,
      kind: g.kind,
      glyph: KIND[g.kind].glyph,
      kindLabel: KIND[g.kind].label,
      hay: `${it.name} ${it.meta} ${it.note} ${g.group} ${KIND[g.kind].label}`.toLowerCase(),
      url: this.resume.techLink(it.name),
    })),
  );

  // one quick-filter chip per group, with a short label + count
  readonly cats = this.resume.skills.map((g) => ({
    group: g.group,
    kind: g.kind,
    short: g.short,
    count: g.items.length,
  }));

  readonly query = signal('');
  readonly activeCat = signal<string | null>(null);
  readonly index = signal(0);

  readonly filtered = computed<Row[]>(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.activeCat();
    return this.rows.filter(
      (r) => (!cat || r.group === cat) && (!q || r.hay.includes(q)),
    );
  });

  /**
   * Splits a symbol name around the live query so the matched run can be
   * marked in the template. Returns a single non-hit part when the query is
   * empty or matches elsewhere (meta/note/group) rather than in the name.
   */
  parts(name: string): NamePart[] {
    const q = this.query().trim().toLowerCase();
    if (!q) return [{ t: name, hit: false }];
    const at = name.toLowerCase().indexOf(q);
    if (at < 0) return [{ t: name, hit: false }];
    const out: NamePart[] = [];
    if (at > 0) out.push({ t: name.slice(0, at), hit: false });
    out.push({ t: name.slice(at, at + q.length), hit: true });
    if (at + q.length < name.length) out.push({ t: name.slice(at + q.length), hit: false });
    return out;
  }

  onQuery(v: string): void {
    this.query.set(v);
    this.index.set(0);
  }

  setCat(group: string | null): void {
    // clicking the active chip clears it back to "All"
    this.activeCat.update((cur) => (cur === group ? null : group));
    this.index.set(0);
  }

  onKey(ev: KeyboardEvent): void {
    const last = this.filtered().length - 1;
    if (last < 0) return;
    let handled = true;
    switch (ev.key) {
      case 'ArrowDown': this.index.update((i) => Math.min(last, i + 1)); break;
      case 'ArrowUp':   this.index.update((i) => Math.max(0, i - 1)); break;
      case 'Home':      this.index.set(0); break;
      case 'End':       this.index.set(last); break;
      default: handled = false;
    }
    if (handled) {
      ev.preventDefault();
      queueMicrotask(() => {
        this.host.nativeElement
          .querySelector(`[data-idx="${this.index()}"]`)
          ?.scrollIntoView({ block: 'nearest' });
      });
    }
  }
}
