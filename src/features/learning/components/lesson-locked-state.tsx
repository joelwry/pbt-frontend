import Link from "next/link";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LessonLockedState({ reason }: { reason?: string }) {
  return (
    <Card className="text-center py-14">
      <div className="h-14 w-14 rounded-full bg-orange-tint text-orange-500 flex items-center justify-center mx-auto mb-4">
        <Lock className="h-6 w-6" />
      </div>
      <h2 className="font-display text-lg font-semibold text-text-primary">This lesson isn&apos;t available yet</h2>
      <p className="text-sm text-text-muted mt-1.5 max-w-sm mx-auto">
        {reason ?? "Check back once it unlocks on your programme schedule."}
      </p>
      <Button variant="secondary" className="mt-6" asChild>
        <Link href="/my-learning">Back to My Learning</Link>
      </Button>
    </Card>
  );
}
