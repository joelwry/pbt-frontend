import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleBarChart } from "@/components/shared/simple-bar-chart";
import { useEventAttendance } from "@/features/admin-analytics/hooks/use-admin-analytics";

export function EventAttendanceCard() {
  const { data: points, isLoading } = useEventAttendance();

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary">Event Attendance</h3>
      <p className="text-sm text-text-muted mt-1 mb-6">RSVPs vs. attendance, last 4 events</p>

      {isLoading || !points ? (
        <Skeleton className="h-[216px] w-full" />
      ) : (
        <SimpleBarChart data={points.map((p) => ({ label: p.eventLabel, value: p.attendeeCount }))} barColorClassName="bg-orange-500" />
      )}
    </Card>
  );
}
