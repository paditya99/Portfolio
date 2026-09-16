/**
 * Minimal SQL tokenizer for syntax highlighting. Intended for the small,
 * controlled query strings shown in the résumé query console — not a general
 * SQL parser. Returns lines of tokens, each carrying a `tok-*` css class.
 */
export interface SqlToken { t: string; c: string }

const KEYWORDS = new Set([
  'select', 'from', 'where', 'order', 'by', 'group', 'desc', 'asc', 'as',
  'and', 'or', 'on', 'join', 'left', 'distinct', 'limit', 'any', 'is',
  'not', 'null', 'true', 'false',
]);
const FUNCTIONS = new Set(['count', 'sum', 'avg', 'max', 'min', 'coalesce']);

const TOKEN = /('(?:[^']|'')*')|([A-Za-z_][A-Za-z0-9_]*)|(\d+\.?\d*)|(\s+)|([(),;.*=@>{}\[\]-]+)/g;

export function highlightSql(sql: string): SqlToken[][] {
  return sql.split('\n').map((line) => {
    const out: SqlToken[] = [];
    let m: RegExpExecArray | null;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(line))) {
      if (m[1]) out.push({ t: m[1], c: 'tok-str' });
      else if (m[2]) {
        const w = m[2].toLowerCase();
        out.push({ t: m[2], c: KEYWORDS.has(w) ? 'tok-key' : FUNCTIONS.has(w) ? 'tok-fn' : 'tok-id' });
      } else if (m[3]) out.push({ t: m[3], c: 'tok-num' });
      else if (m[4]) out.push({ t: m[4], c: '' });
      else out.push({ t: m[5], c: 'tok-op' });
    }
    return out;
  });
}
