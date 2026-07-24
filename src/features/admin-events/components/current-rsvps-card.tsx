import { Card } from "@/components/ui/card";

export function CurrentRsvpsCard({ rsvpCount, capacity }: { rsvpCount: number; capacity: number }) {
  const percent = capacity > 0 ? Math.round((rsvpCount / capacity) * 100) : 0;

  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-text-primary mb-4">Current RSVPs</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary">
          {rsvpCount} of {capacity} spots
        </span>
        <span className="text-sm font-semibold text-text-primary">{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#EDF1F4] overflow-hidden">
        <div
          className={percent >= 90 ? "h-full rounded-full bg-orange-500" : "h-full rounded-full bg-sky-500"}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </Card>
  );
}
