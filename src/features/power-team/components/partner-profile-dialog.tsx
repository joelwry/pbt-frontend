"use client";

import { Mail, Phone, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Partner } from "@/features/power-team/types";

export function PartnerProfileDialog({ partner, trigger }: { partner: Partner; trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-navy-900 text-white text-base font-bold flex items-center justify-center shrink-0">
              {partner.initials}
            </div>
            <div>
              <DialogTitle>{partner.name}</DialogTitle>
              <DialogDescription>{partner.categoryLabel}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {partner.verified && (
          <Badge variant="sky" className="mb-4">
            <ShieldCheck className="h-3 w-3" />
            Verified Partner
          </Badge>
        )}

        <p className="text-sm text-text-secondary leading-relaxed">{partner.bio}</p>

        <div className="space-y-2.5 mt-5 pt-5 border-t border-border">
          <a href={`tel:${partner.phone}`} className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-sky-600">
            <Phone className="h-4 w-4 text-text-muted" />
            {partner.phone}
          </a>
          <a href={`mailto:${partner.email}`} className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-sky-600">
            <Mail className="h-4 w-4 text-text-muted" />
            {partner.email}
          </a>
          <a href={partner.website} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-sky-600">
            <Globe className="h-4 w-4 text-text-muted" />
            {partner.website.replace("https://", "")}
          </a>
        </div>

        <Button className="w-full mt-6" asChild>
          <a href={`mailto:${partner.email}`}>
            <Mail className="h-4 w-4" />
            Get in touch
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
