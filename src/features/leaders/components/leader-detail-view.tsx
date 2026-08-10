"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/shared/avatar";
import { useLeader } from "@/features/leaders/hooks/use-leaders";

export function LeaderDetailView({ leaderId }: { leaderId: string }) {
  const { data: leader, isLoading, isError, refetch } = useLeader(leaderId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-40 w-full rounded-[var(--radius-card)]" />
      </div>
    );
  }

  if (isError || !leader) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <Link
        href="/pbt-leaders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to PBT Leaders
      </Link>

      <PageHeader title={leader.name} description={`PBT Leader${leader.isTopMentor ? " · Mentorship Track" : ""}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <div className="flex items-start gap-4 flex-wrap">
            <Avatar
              src={leader.profileImageUrl}
              alt={leader.name}
              initials={leader.initials}
              className="h-20 w-20 rounded-full text-2xl shrink-0"
            />
            <div className="flex-1 min-w-[200px]">
              <Badge variant="sky">{leader.specialtyBadge}</Badge>
              {leader.isTopMentor && (
                <Badge variant="orange" className="ml-2">
                  Top Mentor 2026
                </Badge>
              )}
              <p className="text-sm text-text-secondary leading-relaxed mt-4">{leader.bio}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="font-display text-base font-semibold text-text-primary mb-3">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {leader.specialties.map((s) => (
                <Badge key={s} variant="outline">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-display text-base font-semibold text-text-primary mb-4">Details</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                <MapPin className="h-4 w-4 text-text-muted shrink-0" />
                {leader.location} · {leader.region}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-text-secondary">
                <Calendar className="h-4 w-4 text-text-muted shrink-0" />
                {leader.yearsActive} years investing
              </li>
              <li className="flex items-center gap-2.5 text-sm text-text-secondary break-all">
                <Mail className="h-4 w-4 text-text-muted shrink-0" />
                {leader.email}
              </li>
            </ul>
            <Button className="w-full mt-5" asChild>
              <a href={`mailto:${leader.email}`}>
                <Mail className="h-4 w-4" />
                Contact {leader.name.split(" ")[0]}
              </a>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
