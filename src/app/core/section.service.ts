import { Injectable } from '@angular/core';
import { SECTIONS, SectionMeta } from './sections';

export interface SectionHeader {
  index?: string;      // '01'..'NN' for numbered sections
  eyebrow?: string;
  live?: boolean;
  emphasis?: boolean;
  title: string;
  file: string;
}

@Injectable({ providedIn: 'root' })
export class SectionService {
  readonly sections: readonly SectionMeta[] = SECTIONS;

  /** id -> derived 2-digit index, computed once from registry order. */
  private readonly indexById = this.computeIndexes();

  /** ids in page order, for the scroll-spy. */
  ids(): string[] {
    return SECTIONS.map((s) => s.id);
  }

  /** header content for a section (used by SectionHeaderComponent). */
  header(id: string): SectionHeader {
    const s = SECTIONS.find((x) => x.id === id);
    if (!s) throw new Error(`Unknown section: ${id}`);
    return {
      index: this.indexById.get(id),
      eyebrow: s.eyebrow,
      live: s.live,
      emphasis: s.emphasis,
      title: s.title ?? '',
      file: s.headerFile ?? '',
    };
  }

  private computeIndexes(): Map<string, string> {
    const map = new Map<string, string>();
    let n = 0;
    for (const s of SECTIONS) {
      if (s.numbered) map.set(s.id, String(++n).padStart(2, '0'));
    }
    return map;
  }
}
