import { Injectable, OnDestroy, signal } from '@angular/core';

/**
 * Tracks scroll-driven UI state for the page shell:
 *  - `activeId`: the section currently under a reference line ~40% down the
 *    viewport (deterministic — recomputed from absolute scroll position, so it
 *    never gets "stuck" the way IntersectionObserver change-events can).
 *  - `scrolled`: whether the page has scrolled past a small threshold.
 */
@Injectable({ providedIn: 'root' })
export class ScrollSpyService implements OnDestroy {
  readonly activeId = signal('');
  readonly scrolled = signal(false);
  /** How far down the page we are, 0–100 — drives the top-bar progress line. */
  readonly progress = signal(0);

  private ids: string[] = [];
  private ticking = false;
  private readonly handler = () => this.onScroll();

  /** Start watching the given section ids (in page order). */
  init(ids: string[]): void {
    this.ids = ids;
    window.addEventListener('scroll', this.handler, { passive: true });
    window.addEventListener('resize', this.handler, { passive: true });
    this.compute();
  }

  private onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.compute();
      this.ticking = false;
    });
  }

  private compute(): void {
    // scrollable distance can be zero on short pages — guard the division
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    this.progress.set(
      scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0,
    );

    if (!this.ids.length) return;
    const line = window.innerHeight * 0.4;

    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;
    if (atBottom) {
      this.activeId.set(this.ids[this.ids.length - 1]);
      return;
    }

    let current = this.ids[0];
    for (const id of this.ids) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) current = id;
    }
    this.activeId.set(current);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handler);
    window.removeEventListener('resize', this.handler);
  }
}
