import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionHeaderComponent } from '../components/section-header.component';
import { ResumeService } from '../core/resume.service';
import { Project } from '../data/resume';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionHeaderComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private resume = inject(ResumeService);
  readonly projects: Project[] = this.resume.projects;

  /** Official docs for a tag, or `undefined` so it renders as plain text. */
  link(tag: string): string | undefined { return this.resume.techLink(tag); }

  /**
   * Tracks the pointer for the radial glow and drives a subtle tilt — both
   * read from CSS custom properties, so the whole effect stays in the sheet.
   */
  onMove(e: PointerEvent): void {
    const el = (e.currentTarget as HTMLElement);
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    // -1..1 from centre, scaled to a few degrees in the stylesheet
    el.style.setProperty('--tx', `${(x / r.width - .5) * 2}`);
    el.style.setProperty('--ty', `${(y / r.height - .5) * 2}`);
  }

  /** Drop the tilt when the pointer leaves so the card settles flat. */
  onLeave(e: PointerEvent): void {
    const el = (e.currentTarget as HTMLElement);
    el.style.setProperty('--tx', '0');
    el.style.setProperty('--ty', '0');
  }
}
