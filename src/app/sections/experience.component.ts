import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionHeaderComponent } from '../components/section-header.component';
import { ResumeService } from '../core/resume.service';
import { Role } from '../data/resume';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionHeaderComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  private resume = inject(ResumeService);
  readonly roles: Role[] = this.resume.roles;
  private hashes = ['c7e14a9', '2f8b60d'];
  hash(i: number): string { return this.hashes[i] ?? '1a2b3c4'; }

  /** Official docs for a stack chip, or `undefined` so it renders as plain text. */
  link(tech: string): string | undefined { return this.resume.techLink(tech); }
}
