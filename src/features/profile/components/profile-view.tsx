"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";
import { PersonalInformationForm } from "@/features/profile/components/personal-information-form";
import { ProfileSummaryCard, NotificationPreferencesCard } from "@/features/profile/components/profile-sidebar-cards";

export function ProfileView() {
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const { data: member, isLoading: memberLoading } = useCurrentMember();

  if (isLoading || memberLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" description="Manage your personal details and preferences." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <Skeleton className="h-72 w-full" />
          </Card>
          <div className="space-y-6">
            <Card>
              <Skeleton className="h-48 w-full" />
            </Card>
            <Card>
              <Skeleton className="h-40 w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile || !member) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" description="Manage your personal details and preferences." />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your personal details and preferences." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <PersonalInformationForm details={profile.details} />
        </div>
        <div className="space-y-6">
          <ProfileSummaryCard member={member} />
          <NotificationPreferencesCard notifications={profile.notifications} />
        </div>
      </div>
    </div>
  );
}
