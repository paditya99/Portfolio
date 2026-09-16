import {
  Profile, SocialLinks, Role, Project, SkillGroup, Achievement,
} from '../data/resume';

/**
 * The contact-section terminal, as a pure function.
 *
 * `run()` takes a typed line plus a snapshot of résumé content and returns the
 * lines to print — no DI, no DOM, no side effects. Anything that has to touch
 * the outside world (clearing the screen, switching theme, scrolling to a
 * section) comes back as an `action` for the component to carry out, so the
 * command table itself stays trivially unit-testable.
 */

export type TermLineKind =
  | 'cmd'   // echo of what the visitor typed
  | 'out'   // fixed-width output — column alignment preserved
  | 'text'  // prose — reflows to the container instead of pre-wrapping
  | 'ok'    // output with a ✔ marker
  | 'err'   // unknown command / bad argument
  | 'dim';  // secondary detail

export interface TermLine { kind: TermLineKind; text: string; }

/** A side effect the component performs after printing. */
export interface TermAction { type: 'clear' | 'theme' | 'open'; value?: string; }

export interface TermResult { lines: TermLine[]; action?: TermAction; }

/** Everything the command table is allowed to read. */
export interface TermContext {
  profile: Profile;
  links: SocialLinks;
  roles: Role[];
  projects: Project[];
  skills: SkillGroup[];
  education: { school: string; detail: string; score: string; year: string }[];
  achievements: Achievement[];
}

export interface TermCommand {
  name: string;
  /** argument hint shown by `help`, e.g. `[filter]` */
  args?: string;
  summary: string;
  /** extra names that resolve here (kept out of `help` and completion) */
  aliases?: string[];
  /** easter eggs — runnable, but not advertised */
  hidden?: boolean;
}

/** The advertised command table. Order is the order `help` prints them. */
export const COMMANDS: TermCommand[] = [
  { name: 'help', summary: 'list everything you can run here' },
  { name: 'whoami', summary: 'the short version' },
  { name: 'pitch', summary: 'why you might want to hire me', aliases: ['why-hire-me', 'why-me', 'fit'] },
  { name: 'experience', summary: 'where I have worked', aliases: ['work'] },
  { name: 'projects', summary: 'what I have built' },
  { name: 'skills', args: '[filter]', summary: 'the stack — try `skills aws`' },
  { name: 'education', summary: 'degrees and milestones' },
  { name: 'contact', summary: 'how to reach me', aliases: ['links'] },
  { name: 'resume', summary: 'download the PDF', aliases: ['cv'] },
  { name: 'open', args: '<section>', summary: 'jump to a section of this page' },
  { name: 'theme', args: '[dark|light]', summary: 'flip the lights' },
  { name: 'clear', summary: 'reset the terminal', aliases: ['cls'] },
  { name: 'sudo', summary: '', hidden: true },
  { name: 'exit', summary: '', hidden: true },
];

/** Section ids `open` accepts — mirrors the section registry. */
const SECTIONS = ['home', 'about', 'experience', 'projects', 'query', 'skills', 'education', 'contact'];

const out = (text: string): TermLine => ({ kind: 'out', text });
/** Prose: let the browser wrap it, so it reads at any terminal width. */
const text = (t: string): TermLine => ({ kind: 'text', text: t });
const ok = (text: string): TermLine => ({ kind: 'ok', text });
const dim = (text: string): TermLine => ({ kind: 'dim', text });
const err = (text: string): TermLine => ({ kind: 'err', text });

/** Resolve a typed word to a command, honouring aliases. */
function lookup(word: string): TermCommand | undefined {
  const w = word.toLowerCase();
  return COMMANDS.find((c) => c.name === w || c.aliases?.includes(w));
}

/** Longest common prefix of the candidates, for Tab completion. */
function commonPrefix(words: string[]): string {
  if (!words.length) return '';
  let p = words[0];
  for (const w of words.slice(1)) {
    let i = 0;
    while (i < p.length && i < w.length && p[i] === w[i]) i++;
    p = p.slice(0, i);
  }
  return p;
}

/**
 * Visible command names that continue `input` — used for the inline ghost
 * suffix and the suggestion row. The exact word is excluded: once you have
 * typed a whole command there is nothing left to suggest.
 */
export function suggest(input: string): string[] {
  const raw = input.trimStart().toLowerCase();
  if (raw.includes(' ')) return [];
  const names = COMMANDS.filter((c) => !c.hidden).map((c) => c.name);
  return raw ? names.filter((n) => n.startsWith(raw) && n !== raw) : [];
}

/**
 * Like `suggest`, but a prefix of an *alias* also surfaces its command — so
 * typing `why` offers `pitch`. Canonical names only, deduped. Used for the
 * suggestion row, never for the ghost: an alias hit gives nothing to append.
 */
export function suggestAll(input: string): string[] {
  const raw = input.trimStart().toLowerCase();
  if (!raw || raw.includes(' ')) return [];
  const hits = COMMANDS.filter(
    (c) => !c.hidden && c.name !== raw &&
      (c.name.startsWith(raw) || c.aliases?.some((a) => a.startsWith(raw))),
  );
  return [...new Set(hits.map((c) => c.name))];
}

/**
 * Expand an unambiguous prefix to the full command so Enter on `who` runs
 * `whoami` instead of erroring. Anything already valid, ambiguous, or carrying
 * arguments is returned untouched.
 */
export function resolveInput(input: string): string {
  const word = input.trim();
  if (!word || word.includes(' ') || lookup(word)) return input;
  const hits = COMMANDS.filter((c) => !c.hidden && c.name.startsWith(word.toLowerCase()));
  return hits.length === 1 ? hits[0].name : input;
}

/**
 * Tab completion over visible command names. Returns the completed word, or
 * the original when there is nothing unambiguous to add.
 */
export function complete(input: string): { value: string; hits: string[] } {
  const raw = input.trimStart();
  // only complete the command word itself, not its arguments
  if (raw.includes(' ')) return { value: input, hits: [] };
  const names = COMMANDS.filter((c) => !c.hidden).map((c) => c.name);
  if (!raw) return { value: input, hits: names };
  const hits = names.filter((n) => n.startsWith(raw.toLowerCase()));
  if (hits.length === 1) return { value: hits[0], hits };
  if (hits.length > 1) return { value: commonPrefix(hits), hits };
  return { value: input, hits: [] };
}

function helpLines(): TermLine[] {
  const visible = COMMANDS.filter((c) => !c.hidden);
  const width = Math.max(...visible.map((c) => `${c.name} ${c.args ?? ''}`.trim().length));
  return [
    dim('available commands —'),
    ...visible.map((c) => {
      const sig = `${c.name} ${c.args ?? ''}`.trim();
      return out(`  ${sig.padEnd(width + 2)}${c.summary}`);
    }),
    dim('  ↑ ↓ history · Tab completes · Esc leaves the input'),
  ];
}

function skillLines(ctx: TermContext, filter: string): TermLine[] {
  if (!filter) {
    return [
      dim(`${ctx.skills.reduce((n, g) => n + g.items.length, 0)} entries across ${ctx.skills.length} groups —`),
      ...ctx.skills.map((g) => out(`  ${g.short.padEnd(12)}${g.items.map((i) => i.name).join(', ')}`)),
      dim('  narrow it down with e.g. `skills aws`'),
    ];
  }
  const q = filter.toLowerCase();
  const hits = ctx.skills.flatMap((g) =>
    g.items
      .filter((i) => `${i.name} ${i.meta} ${i.note} ${g.group}`.toLowerCase().includes(q))
      .map((i) => ({ group: g.short, ...i })),
  );
  if (!hits.length) return [err(`no skill matches "${filter}"`), dim('try `skills` on its own to see everything')];
  return [
    dim(`${hits.length} match${hits.length === 1 ? '' : 'es'} for "${filter}" —`),
    ...hits.map((h) => out(`  ${h.name.padEnd(16)}${h.meta.padEnd(14)}${h.group}`)),
  ];
}

/** Execute one line. Unknown input returns an `err` line, never throws. */
export function run(input: string, ctx: TermContext): TermResult {
  const line = input.trim();
  const echo: TermLine = { kind: 'cmd', text: line };
  if (!line) return { lines: [] };

  const [word, ...rest] = line.split(/\s+/);
  const arg = rest.join(' ');
  const cmd = lookup(word);

  if (!cmd) {
    const guess = COMMANDS.filter((c) => !c.hidden && c.name.startsWith(word[0]?.toLowerCase() ?? ''))
      .map((c) => c.name)
      .slice(0, 3);
    return {
      lines: [
        echo,
        err(`command not found: ${word}`),
        dim(guess.length ? `did you mean ${guess.join(', ')}? — or run \`help\`` : 'run `help` to see what works'),
      ],
    };
  }

  switch (cmd.name) {
    case 'help':
      return { lines: [echo, ...helpLines()] };

    case 'whoami':
      return {
        lines: [
          echo,
          ok(`${ctx.profile.name} — ${ctx.profile.role}`),
          out(`${ctx.links.location} · ${ctx.profile.timezone}`),
          out(ctx.profile.availability),
          dim(ctx.profile.workMode),
        ],
      };

    case 'pitch':
      return { lines: [echo, ...ctx.profile.pitch.map((p) => text(p)), dim('`contact` when you want to talk')] };

    case 'experience':
      return {
        lines: [
          echo,
          ...ctx.roles.flatMap((r) => [
            ok(`${r.company} — ${r.title}`),
            dim(`  ${r.period} · ${r.stack.slice(0, 4).join(' · ')}`),
          ]),
          dim('`open experience` for the detail'),
        ],
      };

    case 'projects':
      return {
        lines: [
          echo,
          ...ctx.projects.map((p) => out(`  ${p.featured ? '★' : '·'} ${p.name} — ${p.kind}`)),
          dim('`open projects` for the detail'),
        ],
      };

    case 'skills':
      return { lines: [echo, ...skillLines(ctx, arg)] };

    case 'education':
      return {
        lines: [
          echo,
          ...ctx.education.map((e) => ok(`${e.school} — ${e.detail} (${e.year}, ${e.score})`)),
          ...ctx.achievements.map((a) => dim(`  ${a.title} · ${a.when}`)),
        ],
      };

    case 'contact':
      return {
        lines: [
          echo,
          ok(`email     ${ctx.links.email}`),
          ok(`linkedin  ${ctx.links.linkedin}`),
          ok(`github    ${ctx.links.github}`),
          dim(ctx.profile.collaboration),
        ],
      };

    case 'resume':
      return { lines: [echo, ok('opening the PDF…')], action: { type: 'open', value: 'resume' } };

    case 'open': {
      const target = arg.toLowerCase();
      if (!target) return { lines: [echo, err('open needs a section'), dim(`one of: ${SECTIONS.join(', ')}`)] };
      if (!SECTIONS.includes(target)) {
        return { lines: [echo, err(`no section "${target}"`), dim(`one of: ${SECTIONS.join(', ')}`)] };
      }
      return { lines: [echo, ok(`jumping to ${target}…`)], action: { type: 'open', value: target } };
    }

    case 'theme': {
      const want = arg.toLowerCase();
      if (want && want !== 'dark' && want !== 'light') {
        return { lines: [echo, err(`unknown theme "${want}"`), dim('try `theme dark` or `theme light`')] };
      }
      return { lines: [echo, ok(want ? `switching to ${want}…` : 'flipping the lights…')], action: { type: 'theme', value: want } };
    }

    case 'clear':
      return { lines: [], action: { type: 'clear' } };

    case 'sudo':
      return { lines: [echo, err('nice try.'), dim('this terminal has exactly one user, and it is not you')] };

    case 'exit':
      return { lines: [echo, dim('there is no escape — but Esc will let go of the input')] };

    default:
      return { lines: [echo, err(`command not found: ${word}`)] };
  }
}
