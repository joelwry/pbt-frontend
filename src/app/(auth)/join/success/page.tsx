import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/shared/brand-mark";

export const metadata: Metadata = {
  title: "Payment Successful | Property Business Training",
};

export default function JoinSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-14">
      <div className="flex items-center gap-3 mb-8">
        <BrandMark size={36} className="border border-border" />
        <p className="font-display text-sm font-bold text-text-primary leading-tight">
          Property Business
          <br />
          Training
        </p>
      </div>

      <Card className="w-full max-w-lg text-center">
        <div className="h-14 w-14 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="font-display text-xl font-bold text-text-primary mt-4">Payment successful!</h1>
        <p className="text-sm text-text-muted mt-2 max-w-sm mx-auto leading-relaxed">
          Welcome to Property Business Training. We&apos;ve sent an email with a link to set your password --
          it can take a minute or two to arrive. Once you&apos;ve set it, you&apos;re ready to sign in.
        </p>

        <Button asChild size="lg" className="w-full mt-6">
          <Link href="/login">Go to Sign In</Link>
        </Button>
      </Card>
    </div>
  );
}
