import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Leader } from "@/features/leaders/types";

export function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <Card className="pbt-hover-lift text-center">
      <div className="h-16 w-16 rounded-full bg-orange-500 text-white text-lg font-bold flex items-center justify-center mx-auto">
        {leader.initials}
      </div>
      <p className="font-semibold text-text-primary mt-3">{leader.name}</p>
      <p className="text-xs text-text-muted mt-0.5">PBT Leader{leader.isTopMentor ? " · Mentorship Track" : ""}</p>
      <div className="mt-3">
        <Badge variant="sky">{leader.specialtyBadge}</Badge>
      </div>
      <p className="inline-flex items-center gap-1 text-xs text-text-muted mt-3">
        <MapPin className="h-3.5 w-3.5" />
        {leader.location}
      </p>
      <Button variant="secondary" size="sm" className="w-full mt-4" asChild>
        <Link href={`/pbt-leaders/${leader.id}`}>
          View Profile
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </Card>
  );
}
