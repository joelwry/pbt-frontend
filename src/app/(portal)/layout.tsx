import { PortalShell } from "@/components/layout/portal-shell";
import { RequireAuth } from "@/components/layout/require-auth";
import { RequireActiveSubscription } from "@/components/layout/require-active-subscription";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <RequireActiveSubscription>
        <PortalShell>{children}</PortalShell>
      </RequireActiveSubscription>
    </RequireAuth>
  );
}
