import { CalendarClock, UploadCloud } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import type { StaffTask } from "@/features/admin-staff-dashboard/types";

const TASK_ICON = {
  calendar: CalendarClock,
  upload: UploadCloud,
};

const TASK_ICON_BG = {
  calendar: "bg-sky-tint text-sky-600",
  upload: "bg-orange-tint text-orange-500",
};

export function YourTasksCard({ tasks }: { tasks: StaffTask[] }) {
  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-text-primary mb-4">Your Tasks</h3>
      {tasks.length === 0 ? (
        <EmptyState icon={CalendarClock} title="Nothing outstanding" description="You're all caught up." />
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => {
            const Icon = TASK_ICON[task.icon];
            return (
              <li key={task.id} className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${TASK_ICON_BG[task.icon]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary leading-snug">{task.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{task.categoryLabel}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
