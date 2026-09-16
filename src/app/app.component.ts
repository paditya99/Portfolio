import { Component, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { SectionService } from './core/section.service';
import { ScrollSpyService } from './core/scroll-spy.service';
import { IntroBootComponent } from './layout/intro-boot.component';
import { TopBarComponent } from './layout/top-bar.component';
import { ExplorerRailComponent } from './layout/explorer-rail.component';
import { StatusBarComponent } from './layout/status-bar.component';
import { SiteFooterComponent } from './layout/site-footer.component';
import { HeroComponent } from './sections/hero.component';
import { AboutComponent } from './sections/about.component';
import { ExperienceComponent } from './sections/experience.component';
import { ProjectsComponent } from './sections/projects.component';
import { QueryConsoleComponent } from './sections/query-console.component';
import { SkillsComponent } from './sections/skills.component';
import { EducationComponent } from './sections/education.component';
import { ContactComponent } from './sections/contact.component';

/**
 * Root shell: composes the layout chrome (boot gate, top bar, explorer rail,
 * status bar) around the ordered content sections. Owns only truly app-global
 * behaviour — initialising the scroll-spy and the page-wide click ripple; every
 * other concern lives in its own component/service.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IntroBootComponent, TopBarComponent, ExplorerRailComponent,
    StatusBarComponent, SiteFooterComponent,
    HeroComponent, AboutComponent, ExperienceComponent, ProjectsComponent,
    QueryConsoleComponent, SkillsComponent, EducationComponent, ContactComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private sections = inject(SectionService);
  private scrollSpy = inject(ScrollSpyService);

  private reduceMotion = false;

  /** Editor-native "caret drop" — a square marquee ring + center block at the pointer. */
  private spawnRipple = (ev: PointerEvent): void => {
    if (this.reduceMotion || ev.button !== 0) return;

    const r = document.createElement('span');
    r.className = 'click-ripple';
    r.style.left = `${ev.clientX}px`;
    r.style.top = `${ev.clientY}px`;
    r.innerHTML = '<i class="cr-ring"></i><i class="cr-core"></i>';
    document.body.appendChild(r);
    // Remove after the longest child animation completes.
    window.setTimeout(() => r.remove(), 700);
  };

  ngAfterViewInit(): void {
    this.scrollSpy.init(this.sections.ids());

    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Ripple on every click, anywhere on the page.
    window.addEventListener('pointerdown', this.spawnRipple, { capture: true, passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('pointerdown', this.spawnRipple, { capture: true });
  }
}
