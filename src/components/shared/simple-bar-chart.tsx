interface BarChartPoint {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: BarChartPoint[];
  barColorClassName?: string;
  height?: number;
}

export function SimpleBarChart({ data, barColorClassName = "bg-sky-500", height = 160 }: SimpleBarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex items-end justify-between gap-3 sm:gap-6" style={{ height: height + 56 }}>
      {data.map((point) => (
        <div key={point.label} className="flex flex-col items-center justify-end flex-1 min-w-0 h-full">
          <span className="text-sm font-semibold text-text-primary mb-2">{point.value}</span>
          <div
            className={`w-full max-w-[42px] rounded-t-lg ${barColorClassName}`}
            style={{ height: Math.max(6, (point.value / max) * height) }}
          />
          <span className="text-xs text-text-muted mt-2 whitespace-nowrap">{point.label}</span>
        </div>
      ))}
    </div>
  );
}
