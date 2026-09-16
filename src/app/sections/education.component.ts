import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionHeaderComponent } from '../components/section-header.component';
import { ResumeService } from '../core/resume.service';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionHeaderComponent],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent {
  private resume = inject(ResumeService);
  readonly education = this.resume.education;
  readonly achievements = this.resume.achievements;
}
