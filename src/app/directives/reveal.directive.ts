import {
  Directive, ElementRef, Input, OnInit, OnDestroy, inject,
} from '@angular/core';

/**
 * Reveals an element on first scroll into view. Adds `.is-visible`
 * (styled globally). Supports a stagger delay via [revealDelay].
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: { '[attr.data-reveal]': '""' },
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;
  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const node = this.el.nativeElement as HTMLElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }
    if (this.revealDelay) node.style.transitionDelay = `${this.revealDelay}ms`;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            node.classList.add('is-visible');
            this.observer?.unobserve(node);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
