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
}

export function DonutChart({ segments, centerValue, centerLabel, size = 168, strokeWidth = 22 }: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segmentsWithOffsets: { key: string; dash: number; offset: number; color: string }[] = [];
  let cumulativePercent = 0;
  for (const segment of segments) {
    const dash = (segment.percent / 100) * circumference;
    const offset = circumference - (cumulativePercent / 100) * circumference;
    segmentsWithOffsets.push({ key: segment.key, dash, offset, color: segment.color });
    cumulativePercent += segment.percent;
  }

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      {segmentsWithOffsets.map((segment) => (
        <circle
          key={segment.key}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={segment.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
          strokeDashoffset={segment.offset}
        />
      ))}
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: 24, fontWeight: 700, fill: "#1F2937" }}
      >
        {centerValue}
      </text>
      <text
        x="50%"
        y="60%"
        textAnchor="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: 11, fill: "#6B7B84" }}
      >
        {centerLabel}
      </text>
    </svg>
  );
}
