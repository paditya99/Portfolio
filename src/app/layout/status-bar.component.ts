import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { ResumeService } from '../core/resume.service';
import { LayoutService } from '../core/layout.service';

/** Fixed editor status bar: branch, availability, active file, current theme. */
@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.scss',
})
export class StatusBarComponent {
  private themeSvc = inject(ThemeService);
  private resume = inject(ResumeService);
  private layout = inject(LayoutService);

  readonly theme = this.themeSvc.theme;
  readonly links = this.resume.links;
  readonly activeFile = this.layout.activeFile;
}
