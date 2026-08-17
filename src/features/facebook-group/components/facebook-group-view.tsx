"use client";

import { Users, MessageCircle, ThumbsUp, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// The client's real, existing group -- no admin-configurable wiring
// requested for this, so it's a plain constant rather than a Site
// Settings field.
const FACEBOOK_GROUP_URL = "https://www.facebook.com/groups/propertybusinesstraining/";

const HIGHLIGHTS = [
  { icon: MessageCircle, label: "Ask questions and get help from fellow members" },
  { icon: ThumbsUp, label: "Share wins, deals and lessons learned" },
  { icon: Users, label: "Connect directly with the PBT team" },
];

export function FacebookGroupView() {
  return (
    <div className="space-y-6">
      <PageHeader title="Facebook Group" description="Connect with the wider PBT community on Facebook." />

      <Card className="relative overflow-hidden text-center py-16 px-6 bg-linear-to-br from-[#8E0E4F] to-[#3D0A24] border-none">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto">
            <Users className="h-7 w-7" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mt-5">The PBT Members Only Facebook Group</h2>
          <p className="text-sm text-white/70 mt-2 max-w-md mx-auto leading-relaxed">
            Join now to get help, support and ideas from your fellow members and the PBT team!
          </p>

          <Button asChild className="mt-7 bg-orange-500 hover:bg-orange-600 text-navy-950">
            <a href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer">
              Join The Group
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-white/50 mt-4">
            <ExternalLink className="h-3.5 w-3.5" />
            Opens in a new tab on Facebook
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {HIGHLIGHTS.map(({ icon: Icon, label }) => (
          <Card key={label} className="text-center py-6">
            <div className="h-10 w-10 rounded-xl bg-sky-tint text-sky-600 flex items-center justify-center mx-auto">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <p className="text-sm font-medium text-text-secondary mt-3 leading-snug">{label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
