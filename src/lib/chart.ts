interface LineChartOptions {
  width: number;
  height: number;
  /** Vertical breathing room so the line never touches the edges. */
  padding?: number;
}

export interface LineChart {
  line: string;
  area: string;
  points: { x: number; y: number }[];
}

/** Scales a series into SVG path data for a simple line + area chart. */
export function lineChart(values: number[], { width, height, padding = 8 }: LineChartOptions): LineChart {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : 0;

  const points = values.map((value, index) => ({
    x: round(index * step),
    y: round(padding + (1 - (value - min) / range) * (height - padding * 2)),
  }));

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  return { line, area, points };
}

const round = (value: number) => Math.round(value * 10) / 10;
