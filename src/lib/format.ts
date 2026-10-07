const whole = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
const money = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatWhole = (value: number): string => whole.format(value);

export const formatMoney = (value: number): string => money.format(value);

/** Signed percentage with a typographic minus, e.g. "+1.6%" / "−3.1%" / "0.0%". */
export function formatChange(value: number | null): string {
  if (value === null) return '—';
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}
