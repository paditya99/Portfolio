/**
 * Central registry of page sections — the single place to add, remove, or
 * reorder a section. Drives the explorer-rail nav, the scroll-spy, and the
 * numbered section headers (numbering is derived, so reordering renumbers).
 */
export interface SectionMeta {
  id: string;
  /** rail label + rail file name */
  label: string;
  navFile: string;
  /** rail icon (SVG path `d`) */
  icon: string;
  /** whether this section's header shows an auto-incremented NN index */
  numbered: boolean;
  /** section-header title (omit for sections with a custom header, e.g. home) */
  title?: string;
  /** section-header right-aligned file label */
  headerFile?: string;
  /** section-header eyebrow shown instead of an index (e.g. the query console) */
  eyebrow?: string;
  /** render a live green pulse before the eyebrow */
  live?: boolean;
  /** slightly larger header title (used by the closing contact section) */
  emphasis?: boolean;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: 'home', label: 'home', navFile: 'home.tsx', numbered: false,
    icon: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5',
  },
  {
    id: 'about', label: 'about', navFile: 'README.md', numbered: true,
    title: 'Who am I', headerFile: 'README.md',
    icon: 'M6 3h9l3 3v15H6zM14 3v4h4',
  },
  {
    id: 'experience', label: 'experience', navFile: 'git.log', numbered: true,
    title: 'Experience', headerFile: 'git log --oneline',
    icon: 'M6 3v12a3 3 0 0 0 3 3h6M6 3a2 2 0 1 0 .01 0M15 18a2 2 0 1 0 .01 0',
  },
  {
    id: 'projects', label: 'projects', navFile: 'projects/', numbered: true,
    title: 'Selected work', headerFile: '~/projects',
    icon: 'M3 7l2-3h5l2 3h7v12H3z',
  },
  {
    id: 'query', label: 'query', navFile: 'query.sql', numbered: false,
    title: 'Query the resume', headerFile: 'query.sql', eyebrow: 'live · career.db', live: true,
    icon: 'M4 6c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2zM4 6v12c0 1.1 3.6 2 8 2s8-.9 8-2V6M4 12c0 1.1 3.6 2 8 2s8-.9 8-2',
  },
  {
    id: 'skills', label: 'skills', navFile: 'skills.ts', numbered: true,
    title: 'Skills', headerFile: 'skills.ts',
    icon: 'M9 6l-5 6 5 6M15 6l5 6-5 6',
  },
  {
    id: 'education', label: 'education', navFile: 'milestones/', numbered: true,
    title: 'Foundations', headerFile: 'education · achievements',
    icon: 'M12 4 2 9l10 5 10-5zM6 12v5c0 1 3 3 6 3s6-2 6-3v-5',
  },
  {
    id: 'contact', label: 'contact', navFile: 'contact.sh', numbered: true,
    title: "Let's build something", headerFile: './contact.sh', emphasis: true,
    icon: 'M4 5h16v14H4zM4 7l8 6 8-6',
  },
];
