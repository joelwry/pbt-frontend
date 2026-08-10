import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.3-1.5 1.6-1.5H16.5V4.3C16.2 4.3 15.2 4 14 4c-2.4 0-4 1.5-4 4.1v2.4H7.5v3H10V21h3.5z" />
    </svg>
  );
}

/**
 * Facebook's own brand blue (#1877F2) is used deliberately here, distinct
 * from the app's navy/sky palette -- it's the one place on the dashboard
 * meant to read as "this connects to Facebook," same reasoning as the
 * platform-colored share buttons on the Referral Hub.
 */
export function FacebookGroupPromoCard() {
  return (
    <Card className="relative overflow-hidden !p-0 border-none" style={{ background: "linear-gradient(135deg, #1877F2 0%, #0C51B8 100%)" }}>
      <div className="px-6 py-6">
        <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center">
          <FacebookIcon className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-display text-base font-bold text-white mt-3">The PBT Members-Only Facebook Group</h3>
        <p className="text-sm text-white/80 mt-1.5 leading-relaxed">
          Join now to get help and support from your fellow members and the PBT team.
        </p>
        <div className="flex items-center gap-1.5 text-xs text-white/70 mt-3">
          <Users className="h-3.5 w-3.5" />
          Active daily — real members, real answers
        </div>
        <Button asChild className="w-full mt-4 bg-white text-[#1877F2] hover:bg-white/90">
          <Link href="/facebook-group">
            Join Group
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
