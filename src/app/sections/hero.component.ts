import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypewriterComponent } from '../components/typewriter.component';
import { ArchDiagramComponent } from '../components/arch-diagram.component';
import { WindowDotsComponent } from '../components/window-dots.component';
import { RevealDirective } from '../directives/reveal.directive';
import { ResumeService } from '../core/resume.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule, TypewriterComponent, ArchDiagramComponent,
    WindowDotsComponent, RevealDirective,
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private resume = inject(ResumeService);
  readonly links = this.resume.links;
  readonly profile = this.resume.profile;
}
