import {
  Component, ElementRef, Injector, afterNextRender, computed, effect, inject, signal, viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionHeaderComponent } from '../components/section-header.component';
import { WindowDotsComponent } from '../components/window-dots.component';
import { ResumeService } from '../core/resume.service';
import { LayoutService } from '../core/layout.service';
import { ThemeService, Theme } from '../services/theme.service';
import { COMMANDS, TermLine, complete, resolveInput, run, suggest, suggestAll } from '../utils/terminal';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective, SectionHeaderComponent, WindowDotsComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private resume = inject(ResumeService);
  private themeSvc = inject(ThemeService);
  private layout = inject(LayoutService);
  private injector = inject(Injector);

  constructor() {
    // "Ask the console" in the top bar — scroll here, then take the caret.
    effect(() => {
      if (!this.layout.consoleRequests()) return; // 0 == nobody has asked yet
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Focus without a second scroll, so it does not fight the smooth one.
      // Touch devices are skipped: focusing there throws up the keyboard mid
      // scroll, and the command chips are the better entry point anyway.
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        this.box()?.nativeElement.focus({ preventScroll: true });
      }
    });
  }

  readonly links = this.resume.links;
  readonly profile = this.resume.profile;

  private readonly box = viewChild<ElementRef<HTMLInputElement>>('box');
  private readonly log = viewChild<ElementRef<HTMLElement>>('log');

  /** Printed output below the two static example commands. */
  readonly lines = signal<TermLine[]>([]);
  readonly draft = signal('');

  /**
   * One-click commands — the primary interface on touch, where nobody types.
   * `pitch` leads and is styled as the primary action: it answers the question
   * a recruiter actually arrived with, and buried in a command line nobody
   * would find it. Hover text comes from the command table so it can't drift.
   */
  readonly chips = ['pitch', 'help', 'projects', 'skills', 'whoami'].map((name) => ({
    name,
    label: name === 'pitch' ? 'why hire me' : name,
    hint: COMMANDS.find((c) => c.name === name)?.summary ?? '',
    primary: name === 'pitch',
  }));

  /**
   * The greyed-out remainder shown after the caret when exactly one command
   * continues what's typed. Ambiguous prefixes get the suggestion row instead,
   * so we never guess visibly at something that might be wrong.
   */
  readonly ghost = computed(() => {
    const d = this.draft();
    if (!d || d.includes(' ')) return '';
    const hits = suggest(d);
    return hits.length === 1 ? hits[0].slice(d.length) : '';
  });

  /**
   * Clickable candidates. Shown when the prefix is ambiguous, and also when it
   * only matches via an alias (`why` → `pitch`) — there the ghost can't help,
   * so the row is the only hint the visitor gets.
   */
  readonly suggestions = computed(() => {
    const d = this.draft();
    if (!d.trim() || d.includes(' ')) return [];
    const hits = suggestAll(d);
    return hits.length > 1 || (hits.length === 1 && !this.ghost()) ? hits.slice(0, 8) : [];
  });

  private history: string[] = [];
  private cursor = -1; // -1 == editing a fresh line rather than browsing history

  private ctx() {
    return {
      profile: this.resume.profile,
      links: this.resume.links,
      roles: this.resume.roles,
      projects: this.resume.projects,
      skills: this.resume.skills,
      education: this.resume.education,
      achievements: this.resume.achievements,
    };
  }

  /** Clicking anywhere in the terminal body should land you in the input. */
  focusInput(): void {
    this.box()?.nativeElement.focus();
  }

  runChip(cmd: string): void {
    this.draft.set(cmd);
    this.submit();
  }

  /** Accept the ghost suffix, completing the word in place. */
  acceptGhost(): void {
    const g = this.ghost();
    if (g) this.draft.update((d) => d + g);
  }

  /**
   * Bring the newest command into view, aligned to the top of the log rather
   * than the bottom: long output (`pitch`, `help`) should be read from its
   * first line, and scrolling to the end would show only its tail. When the
   * output is short enough to fit, the clamp makes this a plain scroll-to-end.
   *
   * Must wait for a real render — a microtask runs before Angular updates the
   * DOM, so the measurements would be taken against the previous content.
   */
  private scrollToEnd(): void {
    afterNextRender(
      () => {
        const el = this.log()?.nativeElement;
        if (!el) return;
        const cmds = el.querySelectorAll<HTMLElement>('.tl-cmd');
        const last = cmds[cmds.length - 1];
        if (!last) { el.scrollTop = el.scrollHeight; return; }
        // rect maths, so it does not depend on offsetParent being the log
        const delta = last.getBoundingClientRect().top - el.getBoundingClientRect().top;
        const max = el.scrollHeight - el.clientHeight;
        el.scrollTop = Math.max(0, Math.min(el.scrollTop + delta, max));
      },
      { injector: this.injector },
    );
  }

  submit(): void {
    // Enter on an unambiguous prefix runs the full command
    const input = resolveInput(this.draft());
    if (!input.trim()) return;

    const { lines, action } = run(input, this.ctx());
    this.history.unshift(input.trim());
    this.cursor = -1;
    this.draft.set('');

    if (action?.type === 'clear') {
      this.lines.set([]);
      const el = this.log()?.nativeElement;
      if (el) el.scrollTop = 0;
    } else {
      this.lines.update((prev) => [...prev, ...lines]);
      this.scrollToEnd();
    }

    switch (action?.type) {
      case 'theme':
        // an explicit `theme dark|light` sets it; a bare `theme` just toggles
        if (action.value === 'dark' || action.value === 'light') this.themeSvc.set(action.value as Theme);
        else this.themeSvc.toggle();
        break;
      case 'open':
        if (action.value === 'resume') window.open(this.links.resume, '_blank', 'noopener');
        else document.getElementById(action.value!)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
    }
  }

  onKey(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowUp':
        if (!this.history.length) return;
        e.preventDefault();
        this.cursor = Math.min(this.cursor + 1, this.history.length - 1);
        this.draft.set(this.history[this.cursor]);
        break;

      case 'ArrowDown':
        if (this.cursor < 0) return;
        e.preventDefault();
        this.cursor -= 1;
        this.draft.set(this.cursor < 0 ? '' : this.history[this.cursor]);
        break;

      case 'Tab': {
        e.preventDefault();
        const { value } = complete(this.draft());
        this.draft.set(value);
        // ambiguous prefixes are already listed live in the suggestion row
        break;
      }

      // →  or  End at the end of the line accepts the ghost, as in a shell
      case 'ArrowRight':
      case 'End': {
        const el = this.box()?.nativeElement;
        const atEnd = el ? el.selectionStart === this.draft().length : false;
        if (atEnd && this.ghost()) {
          e.preventDefault();
          this.acceptGhost();
        }
        break;
      }

      case 'Escape':
        this.box()?.nativeElement.blur();
        break;
    }
  }

  /** Placeholder doubles as the affordance — a blinking caret alone reads as decoration. */
  readonly placeholder = `type 'help' and press ↵`;
  readonly commandCount = COMMANDS.filter((c) => !c.hidden).length;
}
