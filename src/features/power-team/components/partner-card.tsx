import { Building2, MapPin, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PartnerProfileDialog } from "@/features/power-team/components/partner-profile-dialog";
import type { Partner } from "@/features/power-team/types";

export function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <Card className="pbt-hover-lift text-center">
      <div className="h-16 w-16 rounded-full bg-navy-900 text-white text-lg font-bold flex items-center justify-center mx-auto">
        {partner.initials}
      </div>
      <p className="font-semibold text-text-primary mt-3">{partner.name}</p>
      <p className="text-xs text-text-muted mt-0.5 inline-flex items-center gap-1">
        <Building2 className="h-3 w-3" />
        {partner.categoryLabel}
      </p>
      <div className="mt-3">
        {partner.verified && (
          <Badge variant="sky">
            <ShieldCheck className="h-3 w-3" />
            Verified Partner
          </Badge>
        )}
      </div>
      <p className="inline-flex items-center gap-1 text-xs text-text-muted mt-3">
        <MapPin className="h-3.5 w-3.5" />
        {partner.city}
      </p>
      <PartnerProfileDialog
        partner={partner}
        trigger={
          <Button variant="secondary" size="sm" className="w-full mt-4">
            View Profile
          </Button>
        }
      />
    </Card>
  );
}
