"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAuth } from "@/providers/admin-auth-provider";
import { useAdminProfile } from "@/features/admin-profile/hooks/use-admin-profile";
import { AdminPersonalInformationForm } from "@/features/admin-profile/components/admin-personal-information-form";
import { AdminProfileSummaryCard } from "@/features/admin-profile/components/admin-profile-summary-card";
import { AdminNotificationPreferencesCard } from "@/features/admin-profile/components/admin-notification-preferences-card";
import { SecurityCard } from "@/features/admin-profile/components/security-card";

export function AdminProfileView() {
  const { admin } = useAdminAuth();
  const { data: profile, isLoading, isError, refetch } = useAdminProfile();

  if (!admin || isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile & Settings" description="Manage your personal details, notifications and security." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <Skeleton className="h-56 w-full" />
          </Card>
          <div className="space-y-6">
            <Card>
              <Skeleton className="h-40 w-full" />
            </Card>
            <Card>
              <Skeleton className="h-40 w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile & Settings" description="Manage your personal details, notifications and security." />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile & Settings" description="Manage your personal details, notifications and security." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <AdminPersonalInformationForm details={profile.details} />
          <SecurityCard />
        </div>
        <div className="space-y-6">
          <AdminProfileSummaryCard admin={admin} />
          <AdminNotificationPreferencesCard notifications={profile.notifications} />
        </div>
      </div>
    </div>
  );
}
