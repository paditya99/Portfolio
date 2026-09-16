import { ArchFlow, ArchNode } from '../data/resume';

/** A node positioned in canvas coordinates (centre point `cx`/`cy`) with the
 *  width its own text needs (`w`). */
export interface LaidNode extends ArchNode { cx: number; cy: number; w: number; }

/** An edge resolved to an SVG cubic-bézier path plus its packet animation timing. */
export interface LaidEdge {
  id: string; d: string; from: string; to: string;
  bidir: boolean; dur: number; delay: number;
}

/* Canvas geometry — the diagram is laid out against these fixed dimensions and
   scaled responsively by the SVG viewBox. Node x/y in ARCH_FLOWS are percentages. */
export const ARCH_W = 1200;
export const ARCH_H = 470;
/** Minimum box width — narrower text still renders a box this wide. */
export const BOX_W = 150;
/** Ceiling, so one long label can never overlap the neighbouring column. */
export const BOX_W_MAX = 185;
export const BOX_H = 56;
const PADX = 80;
const PADY = 56;

/* Text metrics for `measureBox`. SVG has no layout pass we can read before
   paint, so box width is estimated from character count against the two fonts
   actually used by `.node-label` / `.node-sub` in the component stylesheet:
   Space Grotesk 600 @14px, and JetBrains Mono @11px (0.6em advance) + .02em
   letter-spacing. Deliberately a touch generous — a slightly wide box is
   invisible, a narrow one clips the text. Keep in sync with the SCSS. */
const LABEL_CH = 7.9;
const SUB_CH = 6.9;
/** Horizontal breathing room each side; the text starts at x=14 in the template. */
const TEXT_PAD = 14;

/** Width a node needs to hold its own label and sub-label without clipping. */
export function measureBox(n: Pick<ArchNode, 'label' | 'sub'>): number {
  const needed = Math.max(n.label.length * LABEL_CH, n.sub.length * SUB_CH) + TEXT_PAD * 2;
  return Math.min(BOX_W_MAX, Math.max(BOX_W, Math.ceil(needed)));
}

/** Resolve each flow node's percentage position to an absolute centre point. */
export function layoutNodes(flow: ArchFlow): LaidNode[] {
  return flow.nodes.map((n) => ({
    ...n,
    cx: PADX + (n.x / 100) * (ARCH_W - 2 * PADX),
    cy: PADY + (n.y / 100) * (ARCH_H - 2 * PADY),
    w: measureBox(n),
  }));
}

/**
 * Build the SVG path for every edge of a flow. Edges enter/leave nodes
 * horizontally, so each end is trimmed to the box's left/right border (+ a small
 * gap) — packets then sit in the open space between nodes instead of hiding under
 * the boxes. Edges leaving a shared source are fanned vertically so they don't
 * stack, while the arrival stays centred on the target.
 */
export function layoutEdges(flow: ArchFlow, nodes: LaidNode[], flowId: string): LaidEdge[] {
  const map = new Map(nodes.map((n) => [n.id, n]));
  const GAP = 6; // clearance between a box border and the edge that leaves it
  const FAN = 13; // vertical spread at a shared source
  return flow.edges.map((e, i) => {
    const a = map.get(e.from)!, b = map.get(e.to)!;
    const s = b.cx >= a.cx ? 1 : -1;
    const dyAB = b.cy - a.cy;
    const bias = Math.abs(dyAB) > 4 ? Math.sign(dyAB) * FAN : 0;
    // trim per node — boxes are sized to their own text, so the two ends differ
    const ax = a.cx + s * (a.w / 2 + GAP), bx = b.cx - s * (b.w / 2 + GAP);
    // Fan out at the source; arrive centred on the target so the arrowhead meets
    // the box squarely. A long horizontal tail (0.5) keeps the arrow flat even
    // when the target is well above/below the source.
    const ay = a.cy + bias, by = b.cy;
    const dx = (bx - ax) * 0.5;
    return {
      id: `edge-${flowId}-${i}`,
      from: e.from, to: e.to, bidir: !!e.bidir,
      d: `M ${ax} ${ay} C ${ax + dx} ${ay}, ${bx - dx} ${by}, ${bx} ${by}`,
      dur: 2.4 + (i % 3) * 0.6,
      delay: (i % 4) * 0.45,
    };
  });
}
