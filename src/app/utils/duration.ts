/**
 * Duration helpers for the résumé data. Dates are 'YYYY-MM' strings.
 */

/** Whole-year decimal between two 'YYYY-MM' dates, e.g. '3.7'. */
export function yearsBetween(from: string, to: string): string {
  const [fy, fm] = from.split('-').map(Number);
  const [ty, tm] = to.split('-').map(Number);
  return (((ty * 12 + tm) - (fy * 12 + fm)) / 12).toFixed(1);
}
