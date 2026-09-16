import {
  Component, signal, AfterViewInit, OnDestroy,
} from '@angular/core';

/**
 * The intro "boot gate": a terminal that compiles the workspace, then hands off
 * to the page with a square-iris reveal and a soundtrack. Fully self-contained —
 * it overlays the workspace with fixed-position layers and owns the scroll lock,
 * so the rest of the app needs no knowledge of the boot sequence.
 */
@Component({
  selector: 'app-intro-boot',
  standalone: true,
  templateUrl: './intro-boot.component.html',
  styleUrl: './intro-boot.component.scss',
})
export class IntroBootComponent implements AfterViewInit, OnDestroy {
  readonly booting = signal(false);   // boot sequence is running
  readonly revealing = signal(false); // handing off to the workspace (exit + entrance)
  readonly booted = signal(false);    // overlay fully gone
  readonly ringDone = signal(false);  // reveal ripple finished
  readonly bootLine = signal(0);      // how many log lines are visible

  /** Boot log — the workspace "compiling" in this Node/AI engineer's voice. */
  readonly BOOT_LOG = [
    { text: 'mounting ~/aditya-pathak', tag: 'ok' },
    { text: 'npm ci · 2.5+ yrs', tag: 'ok' },
    { text: 'nest start · services up', tag: 'ok' },
    { text: 'bedrock · retrieval ready', tag: 'ok' },
    { text: 'compiling workspace', tag: 'ok' },
  ];

  private audio?: HTMLAudioElement;
  private audioCtx?: AudioContext;
  private reduceMotion = false;
  private timers: number[] = [];

  // Boot terminal shows for BOOT_MS, then the workspace slowly appears over
  // REVEAL_MS (the ~5.14s clip keeps playing under the tail).
  private readonly BOOT_MS = 2900;   // init page visible before the reveal
  private readonly REVEAL_MS = 2000; // main page fades/ripples in over this
  readonly barMs = this.BOOT_MS;     // loader fill + reveal trigger

  /** Enter / click on the gate: boot the first time, skip to reveal if already booting. */
  enter(): void {
    if (this.booted() || this.revealing()) return;
    if (this.booting()) { this.reveal(); return; }
    this.boot();
  }

  private onKey = (e: KeyboardEvent): void => {
    if (this.booted() || this.revealing()) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      this.enter();
    }
  };

  private boot(): void {
    this.booting.set(true);

    // Play the soundtrack, routed through a gain boost (the clip is quiet).
    this.audio = new Audio('media/the_trial_of_the_bow.mp3');
    this.audio.volume = 1;
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new Ctx();
      const src = this.audioCtx.createMediaElementSource(this.audio);
      const gain = this.audioCtx.createGain();
      gain.gain.value = 2.4;
      src.connect(gain).connect(this.audioCtx.destination);
      if (this.audioCtx.state === 'suspended') void this.audioCtx.resume();
    } catch { /* fall back to the bare element */ }
    this.audio.play().catch(() => { /* playback unavailable */ });

    const n = this.BOOT_LOG.length;
    if (this.reduceMotion) {
      this.bootLine.set(n); // no typing stagger under reduced motion
    } else {
      const start = 300;
      const step = Math.max(260, Math.floor((this.barMs - start - 500) / n));
      for (let i = 0; i < n; i++) {
        this.timers.push(window.setTimeout(() => this.bootLine.set(i + 1), start + i * step));
      }
    }

    // Reveal just before the clip ends; also reveal if the audio ends first.
    this.timers.push(window.setTimeout(() => this.reveal(), this.barMs));
    this.audio.addEventListener('ended', () => this.reveal(), { once: true });
  }

  private reveal(): void {
    if (this.revealing()) return;
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
    this.revealing.set(true);            // clip-path wipe + ripple wavefront begin
    // Clear the boot terminal quickly so the wipe is unobstructed.
    this.timers.push(window.setTimeout(() => this.booted.set(true), 650));
    // Keep scroll locked (viewport centre stays put for the clip) until the
    // wipe finishes, then drop the clip and unlock.
    if (this.reduceMotion) this.finishReveal();
    else this.timers.push(window.setTimeout(() => this.finishReveal(), this.REVEAL_MS));
  }

  private finishReveal(): void {
    this.ringDone.set(true);            // clip-path -> none, ripple removed
    document.body.style.overflow = '';  // unlock scrolling once fully revealed
  }

  ngAfterViewInit(): void {
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // The intro always plays from the top, so don't let the browser restore a
    // prior scroll position on refresh — start fresh at the hero.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    // Gate the workspace behind the boot terminal: lock scroll and listen for Enter.
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', this.onKey);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKey);
    this.timers.forEach((t) => clearTimeout(t));
    document.body.style.overflow = '';
    this.audio?.pause();
    void this.audioCtx?.close();
    this.audio = undefined;
  }
}
