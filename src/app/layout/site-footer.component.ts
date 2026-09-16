import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../core/resume.service';

/** Closing content footer under the main column. */
@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
})
export class SiteFooterComponent {
  private resume = inject(ResumeService);
  readonly profile = this.resume.profile;
  readonly year = new Date().getFullYear();
  readonly ngVersion = '19';
}
