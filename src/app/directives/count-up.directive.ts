import {
  Directive, ElementRef, Input, OnInit, OnDestroy, inject,
} from '@angular/core';

/**
 * Counts a stat value up from zero the first time it scrolls into view.
 *
 * The bound value is the finished string as authored (`2.5+`, `30+`, `350+`),
 * so any prefix/suffix and decimal precision are preserved — only the numeric
 * run is animated. Values with no digits, and reduced-motion users, get the
 * final string immediately.
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, OnDestroy {
  /** The final, already-formatted value (e.g. `2.5+`). */
  @Input('appCountUp') value = '';

  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private frame?: number;

  private readonly DURATION = 1100;

  ngOnInit(): void {
    const node = this.el.nativeElement as HTMLElement;
    const match = /(\d[\d,]*\.?\d*)/.exec(this.value);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!match || reduce || typeof IntersectionObserver === 'undefined') {
      node.textContent = this.value;
      return;
    }

    const raw = match[1];
    const target = Number(raw.replace(/,/g, ''));
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
    const before = this.value.slice(0, match.index);
    const after = this.value.slice(match.index + raw.length);

    node.textContent = `${before}${(0).toFixed(decimals)}${after}`;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          this.observer?.unobserve(node);
          this.animate(node, target, decimals, before, after);
        }
      },
      { threshold: 0.4 },
    );
    this.observer.observe(node);
  }

  private animate(
    node: HTMLElement, target: number, decimals: number,
    before: string, after: string,
  ): void {
    const start = performance.now();
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / this.DURATION);
      // ease-out cubic — fast off the mark, settles onto the final digit
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = `${before}${(target * eased).toFixed(decimals)}${after}`;
      if (t < 1) this.frame = requestAnimationFrame(tick);
      else node.textContent = `${before}${target.toFixed(decimals)}${after}`;
    };
    this.frame = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.frame) cancelAnimationFrame(this.frame);
  }
}
