"use client";

import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ProgrammeProgress } from "@/features/dashboard/types";

function ProgressRing({ percent }: { percent: number }) {
  const size = 108;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EDF1F4" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#26AAE1"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 600ms ease" }}
      />
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        className="rotate-90"
        style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: 22, fontWeight: 700, fill: "#1F2937" }}
      >
        {percent}%
      </text>
      <text
        x="50%"
        y="64%"
        textAnchor="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: 10, fill: "#6B7B84" }}
      >
        Overall
      </text>
    </svg>
  );
}

export function ProgrammeProgressCard({ progress }: { progress: ProgrammeProgress }) {
  const metrics = [
    { label: "Completed", value: progress.completed },
    { label: "Unlocked, In Progress", value: progress.unlockedInProgress },
    { label: "Upcoming", value: progress.upcoming },
    { label: "Total This Year", value: progress.totalThisYear },
  ];

  return (
    <Card>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-text-primary">Programme Progress</h3>
          <p className="text-sm text-text-muted mt-1">
            Your learning journey (ongoing) — new content unlocks on schedule
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-text-primary bg-white">
          {progress.programmeLabel}
          <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
        </button>
      </div>

      <div className="flex items-center gap-6 flex-wrap sm:flex-nowrap">
        <ProgressRing percent={progress.overallPercent} />
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-medium text-text-primary">{progress.encouragement}</p>
          <div className="h-2 rounded-full bg-[#EDF1F4] mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-500"
              style={{ width: `${progress.overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-7 pt-6 border-t border-border">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <p className="font-display text-2xl font-bold text-text-primary">{metric.value}</p>
            <p className="text-xs text-text-muted mt-1">{metric.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
