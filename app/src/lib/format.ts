// Number + string formatting helpers. Tabular numerals are enabled in CSS.

export function fmtNum(v: number | null, maxDigits = 2): string {
  if (v === null || Number.isNaN(v)) return '—';
  return v.toLocaleString('en-US', {
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: 0,
  });
}

export function fmtSignedPct(v: number | null): string {
  if (v === null) return '—';
  return `${v >= 0 ? '+' : ''}${v.toFixed(0)}%`;
}

export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}
