import { Card } from "@/components/ui/card";

export function ProgrammeSummaryCard({
  label,
  note,
  percent,
}: {
  label: string;
  note: string;
  percent: number;
}) {
  const size = 96;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <Card className="bg-gradient-to-br from-navy-950 to-navy-900 border-none">
      <div className="flex items-center justify-between gap-6 flex-wrap sm:flex-nowrap">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">{label}</h3>
          <p className="text-sm text-white/60 mt-2 max-w-2xl leading-relaxed">{note}</p>
        </div>
        <svg width={size} height={size} className="shrink-0 -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F18D00"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <text
            x="50%"
            y="46%"
            textAnchor="middle"
            style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: 20, fontWeight: 700, fill: "#fff" }}
          >
            {percent}%
          </text>
          <text
            x="50%"
            y="66%"
            textAnchor="middle"
            style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: 9, fill: "rgba(255,255,255,0.6)" }}
          >
            This Year
          </text>
        </svg>
      </div>
    </Card>
  );
}
