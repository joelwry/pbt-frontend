export interface DonutSegment {
  key: string;
  percent: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerValue: string;
  centerLabel: string;
  size?: number;
  strokeWidth?: number;
  /** Describes the chart for screen readers; falls back to the centre text. */
  ariaLabel?: string;
}

/** Neutral ring drawn under the segments so a chart with no data still reads as a doughnut. */
const TRACK_COLOR = "#EDF1F4";

export function DonutChart({
  segments,
  centerValue,
  centerLabel,
  size = 168,
  strokeWidth = 22,
  ariaLabel,
}: DonutChartProps) {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segmentsWithOffsets: { key: string; dash: number; offset: number; color: string }[] = [];
  let cumulativePercent = 0;
  for (const segment of segments) {
    if (segment.percent <= 0) continue;
    const dash = (segment.percent / 100) * circumference;
    const offset = circumference - (cumulativePercent / 100) * circumference;
    segmentsWithOffsets.push({ key: segment.key, dash, offset, color: segment.color });
    cumulativePercent += segment.percent;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      role="img"
      aria-label={ariaLabel ?? `${centerValue} ${centerLabel}`}
    >
      {/* Only the arcs rotate, so they start at 12 o'clock. Rotating the
          whole SVG (as this did) forced a counter-rotation on the labels,
          and `transform-origin: center` on an SVG <text> resolves against
          that text's own bounding box rather than the ring's centre -- so
          the two labels drifted apart and overlapped each other. Keeping
          the text out of the rotated group removes the problem entirely
          rather than trying to correct for it. */}
      <g transform={`rotate(-90 ${center} ${center})`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke={TRACK_COLOR} strokeWidth={strokeWidth} />
        {segmentsWithOffsets.map((segment) => (
          <circle
            key={segment.key}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
            strokeDashoffset={segment.offset}
            style={{ transition: "stroke-dasharray 600ms cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        ))}
      </g>
      <text
        x={center}
        y={center - size * 0.045}
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-display"
        style={{ fontSize: size * 0.17, fontWeight: 700, fill: "#1F2937" }}
      >
        {centerValue}
      </text>
      <text
        x={center}
        y={center + size * 0.105}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: size * 0.068, fill: "#6B7B84", letterSpacing: "0.04em" }}
      >
        {centerLabel}
      </text>
    </svg>
  );
}
