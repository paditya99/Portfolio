import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../core/resume.service';
import { SectionService } from '../core/section.service';
import { ScrollSpyService } from '../core/scroll-spy.service';
import { LayoutService } from '../core/layout.service';

/**
 * VS Code-style explorer rail: the section registry rendered as a file tree.
 * On mobile it slides in over a scrim. `:host { display: contents }` keeps the
 * inner `<aside>` as the direct grid item of the shell layout.
 */
@Component({
  selector: 'app-explorer-rail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explorer-rail.component.html',
  styleUrl: './explorer-rail.component.scss',
})
export class ExplorerRailComponent {
  private resume = inject(ResumeService);
  private sections = inject(SectionService);
  private scrollSpy = inject(ScrollSpyService);
  private layout = inject(LayoutService);

  readonly nav = this.sections.sections;
  readonly links = this.resume.links;
  readonly active = this.scrollSpy.activeId;
  readonly menuOpen = this.layout.menuOpen;

  toggleMenu(): void { this.layout.toggleMenu(); }

  go(id: string, ev?: Event): void {
    ev?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.layout.closeMenu();
  }
}
