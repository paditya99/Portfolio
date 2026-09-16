import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { ResumeService } from '../core/resume.service';
import { ScrollSpyService } from '../core/scroll-spy.service';
import { LayoutService } from '../core/layout.service';

/** Fixed editor top bar: breadcrumb, résumé/email links, theme toggle, mobile burger. */
@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  private themeSvc = inject(ThemeService);
  private resume = inject(ResumeService);
  private scrollSpy = inject(ScrollSpyService);
  private layout = inject(LayoutService);

  readonly theme = this.themeSvc.theme;
  readonly links = this.resume.links;
  readonly scrolled = this.scrollSpy.scrolled;
  readonly progress = this.scrollSpy.progress;
  readonly activeFile = this.layout.activeFile;
  readonly menuOpen = this.layout.menuOpen;

  toggleTheme(): void { this.themeSvc.toggle(); }
  toggleMenu(): void { this.layout.toggleMenu(); }
  askConsole(): void { this.layout.focusConsole(); }
}
