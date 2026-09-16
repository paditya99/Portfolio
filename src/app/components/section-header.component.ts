import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionService } from '../core/section.service';

/**
 * Shared header for every content section. Content (index/eyebrow/title/file)
 * comes from the central SectionService, so a section only declares which id
 * it is: `<app-section-header id="experience" />`.
 */
@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  @Input({ required: true }) id!: string;
  private sections = inject(SectionService);
  readonly h = computed(() => this.sections.header(this.id));
}
