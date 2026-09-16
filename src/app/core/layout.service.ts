import { Injectable, computed, inject, signal } from '@angular/core';
import { SectionService } from './section.service';
import { ScrollSpyService } from './scroll-spy.service';

/**
 * Shell-level UI state shared across the layout chrome (top bar, explorer rail,
 * status bar). Kept in a service — rather than passed through inputs/outputs —
 * so each chrome component can inject exactly what it needs, matching the
 * signal-service pattern used by ThemeService / ScrollSpyService.
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private sections = inject(SectionService);
  private scrollSpy = inject(ScrollSpyService);

  /** Mobile explorer-rail open/closed — toggled by the top-bar burger, the rail, the scrim. */
  readonly menuOpen = signal(false);

  /** `navFile` of the section currently in view — drives the breadcrumb + status bar. */
  readonly activeFile = computed(() =>
    this.sections.sections.find((n) => n.id === this.scrollSpy.activeId())?.navFile ?? 'home.tsx',
  );

  /**
   * Bumped when something in the chrome asks for the contact console — the
   * contact section watches it and takes focus. A counter rather than a boolean
   * so repeat requests still fire; nothing has to reset it.
   */
  readonly consoleRequests = signal(0);

  toggleMenu(): void { this.menuOpen.update((v) => !v); }
  closeMenu(): void { this.menuOpen.set(false); }

  /** Jump the visitor into the contact terminal, wherever they are on the page. */
  focusConsole(): void {
    this.closeMenu();
    this.consoleRequests.update((n) => n + 1);
  }
}
