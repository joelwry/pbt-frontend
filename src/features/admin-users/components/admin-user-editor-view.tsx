"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/providers/toast-provider";
import { useAdminAccount, useSaveAdminAccount } from "@/features/admin-users/hooks/use-admin-users";
import { ADMIN_SECTION_LABELS, ROLE_DEFAULT_SECTIONS, ASSIGNABLE_ADMIN_ROLES } from "@/features/admin-auth/permissions";
import type { AdminAccount } from "@/features/admin-users/types";
import { ADMIN_ROLES, ADMIN_ROLE_LABELS } from "@/features/admin-auth/types";
import type { AdminRole, AdminSection } from "@/features/admin-auth/types";

// All five roles are assignable. "Admin" was previously missing here, so an
// account holding it — every account created outside this form — could be
// seen but never chosen, and picking any other role was a one-way door.
const ROLES = ASSIGNABLE_ADMIN_ROLES;
const SECTIONS = Object.keys(ADMIN_SECTION_LABELS) as AdminSection[];

const SECTION_DESCRIPTIONS: Record<AdminSection, string> = {
  members: "View and manage member accounts and profiles",
  content: "Create, edit and schedule lessons",
  resources: "Upload and manage downloadable resources",
  events: "Create and manage events and RSVPs",
  community: "Moderate posts, pin announcements, manage groups",
  pbtLeaders: "Manage the PBT Leaders directory",
  powerTeam: "Manage vetted Power Team partners",
  subscriptions: "View revenue, invoices and payment status",
  analytics: "View platform-wide analytics and reports",
  referrals: "View member referrals and rewards issued",
};

const editorSchema = z.object({
  fullName: z.string().min(2, "Enter the staff member's full name"),
  email: z.string().email("Enter a valid email address"),
  role: z.enum(ADMIN_ROLES),
  sections: z.array(z.string()),
});
type EditorFormValues = z.infer<typeof editorSchema>;

function initialsFor(fullName: string) {
  return (
    fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "AU"
  );
}

function nextStaffId(role: AdminRole) {
  const prefix = role === "SUPER_ADMIN" ? "PBT-A-" : "PBT-S-";
  return `${prefix}${String(Math.floor(1000 + Math.random() * 9000)).slice(0, 4)}`;
}

function buildAccount(values: EditorFormValues, isNew: boolean, accountId: string, existing?: AdminAccount): AdminAccount {
  return {
    id: isNew ? `au_${Date.now()}` : accountId,
    adminId: existing?.adminId ?? nextStaffId(values.role),
    fullName: values.fullName,
    initials: initialsFor(values.fullName),
    email: values.email,
    role: values.role as AdminRole,
    sections: values.sections as AdminSection[],
    status: existing?.status ?? "Invited",
    accessNote: existing?.accessNote,
  };
}

/**
 * Fetches first, renders the form second. The form below seeds its own state
 * from `account` in a lazy useState initializer, which only works if it
 * mounts once the real data is already here — syncing it in afterwards would
 * be a setState inside an effect, which this repo's ESLint config treats as
 * a build error (see ARCHITECTURE_HANDBOOK.md §3.4).
 */
export function AdminUserEditorView({ accountId }: { accountId: string }) {
  const isNew = accountId === "new";
  const { data: account, isLoading, isError, refetch } = useAdminAccount(accountId);

  if (!isNew && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-72 lg:col-span-2 rounded-[var(--radius-card)]" />
          <Skeleton className="h-96 rounded-[var(--radius-card)]" />
        </div>
      </div>
    );
  }

  if (!isNew && (isError || !account)) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return <AdminUserForm accountId={accountId} isNew={isNew} account={isNew ? undefined : account} />;
}

function AdminUserForm({
  accountId,
  isNew,
  account,
}: {
  accountId: string;
  isNew: boolean;
  account?: AdminAccount;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: saveAccount, isPending } = useSaveAdminAccount();

  /**
   * Whether this account inherits its role's access or holds a set chosen by
   * hand. The two are genuinely different instructions to the API, not two
   * ways of describing one list: inheriting means the account follows its
   * role, including if that role's defaults ever change, while a chosen set
   * — an empty one included — is honoured exactly as saved.
   *
   * New accounts start out inheriting; an existing one starts wherever the
   * API says it already is.
   */
  const [useRoleDefaults, setUseRoleDefaults] = useState(!account?.sectionsCustomised);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditorFormValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      fullName: account?.fullName ?? "",
      email: account?.email ?? "",
      role: account?.role ?? "CONTENT_MANAGER",
      sections: account?.sections ?? ROLE_DEFAULT_SECTIONS.CONTENT_MANAGER,
    },
  });

  const watchedRole = watch("role");
  const watchedSections = watch("sections");

  function handleRoleChange(nextRole: AdminRole) {
    setValue("role", nextRole);
    setValue("sections", ROLE_DEFAULT_SECTIONS[nextRole]);
  }

  function handleUseRoleDefaultsChange(next: boolean) {
    setUseRoleDefaults(next);
    // Show what inheriting actually means, rather than leaving the previous
    // hand-picked list on screen while the account no longer uses it.
    if (next) setValue("sections", ROLE_DEFAULT_SECTIONS[watchedRole]);
  }

  function handleSave(values: EditorFormValues, sendInvite: boolean) {
    saveAccount(
      { account: buildAccount(values, isNew, accountId, account), useRoleDefaults },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            title: isNew ? (sendInvite ? "Invite sent" : "Draft saved") : "Admin account updated",
            description: isNew && sendInvite ? `${values.fullName} will receive an email to set their password.` : undefined,
          });
          router.push("/admin/admin-users");
        },
      }
    );
  }

  const isSuperAdminRole = watchedRole === "SUPER_ADMIN";
  const hasNoSections = !useRoleDefaults && watchedSections.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNew ? "Invite Admin User" : "Edit Admin User"}
        description="Grant a staff member access to the admin portal."
        backHref="/admin/admin-users"
        backLabel="Back to Admin Users & Roles"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Staff Details</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName")} invalid={!!errors.fullName} />
              {errors.fullName && <p className="text-xs text-error">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email")} invalid={!!errors.email} />
              {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <select
                    id="role"
                    value={field.value}
                    onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
                    className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ADMIN_ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                )}
              />
              <p className="text-xs text-text-muted">
                The role sets what this person can reach by default — you can still fine-tune it under Section Access.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-display text-base font-semibold text-text-primary mb-1">Section Access</h3>
            {isSuperAdminRole ? (
              <p className="text-sm text-text-muted mt-3">Super Admins have full access to every section automatically.</p>
            ) : (
              <>
                <label className="flex items-start gap-2.5 cursor-pointer select-none mt-3 mb-4">
                  <input
                    type="checkbox"
                    checked={useRoleDefaults}
                    onChange={(e) => handleUseRoleDefaultsChange(e.target.checked)}
                    className="h-4 w-4 mt-0.5 rounded accent-sky-600"
                  />
                  <span>
                    <span className="block text-sm font-medium text-text-primary">
                      Use the {ADMIN_ROLE_LABELS[watchedRole]} defaults
                    </span>
                    <span className="block text-xs text-text-muted mt-0.5">
                      {useRoleDefaults
                        ? "This account follows its role. Untick to choose sections yourself."
                        : "Sections below are set for this account specifically."}
                    </span>
                  </span>
                </label>

                <Controller
                  control={control}
                  name="sections"
                  render={({ field }) => (
                    <div className="space-y-4">
                      {SECTIONS.map((section) => {
                        const checked = (field.value as string[]).includes(section);
                        return (
                          <label
                            key={section}
                            className={`flex items-start gap-2.5 select-none ${useRoleDefaults ? "cursor-default opacity-60" : "cursor-pointer"}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={useRoleDefaults}
                              onChange={(e) => {
                                const current = field.value as string[];
                                field.onChange(e.target.checked ? [...current, section] : current.filter((s) => s !== section));
                              }}
                              className="h-4 w-4 mt-0.5 rounded accent-sky-600"
                            />
                            <span>
                              <span className="block text-sm font-medium text-text-primary">{ADMIN_SECTION_LABELS[section]}</span>
                              <span className="block text-xs text-text-muted mt-0.5">{SECTION_DESCRIPTIONS[section]}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                />

                {hasNoSections && (
                  <p className="text-xs text-error mt-4">
                    With nothing ticked, this person can sign in but won&apos;t be able to open any admin area.
                  </p>
                )}
              </>
            )}
          </Card>

          {isNew ? (
            <div className="space-y-2.5">
              <Button className="w-full" disabled={isPending} onClick={handleSubmit((values) => handleSave(values, true))}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isPending ? "Sending…" : "Send Invite"}
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                disabled={isPending}
                onClick={handleSubmit((values) => handleSave(values, false))}
              >
                <Save className="h-4 w-4" />
                Save as Draft
              </Button>
            </div>
          ) : (
            <Button className="w-full" disabled={isPending} onClick={handleSubmit((values) => handleSave(values, false))}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isPending ? "Saving…" : "Save Changes"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
