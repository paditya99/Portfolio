import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initial());

  constructor() {
    effect(() => {
      const t = this.theme();
      document.documentElement.setAttribute('data-theme', t);
      document.documentElement.style.colorScheme = t;
      try {
        localStorage.setItem('portfolio-theme', t);
      } catch { /* storage may be unavailable */ }
      const meta = document.querySelector('meta[name="theme-color"]');
      meta?.setAttribute('content', t === 'dark' ? '#0C1118' : '#F4F6FB');
    });
  }

  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  /** Set an explicit theme (the contact terminal's `theme dark|light`). */
  set(t: Theme): void {
    this.theme.set(t);
  }

  private initial(): Theme {
    try {
      const saved = localStorage.getItem('portfolio-theme') as Theme | null;
      if (saved === 'dark' || saved === 'light') return saved;
    } catch { /* ignore */ }
    const prefersLight =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }
}
