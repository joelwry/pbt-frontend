"use client";

import { useState } from "react";
import axios from "axios";
import { CheckCircle2, Clock, Copy, Check, Link2, Loader2, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/providers/toast-provider";
import { useCreateSetupLink, useResendWelcomeEmail } from "@/features/admin-members/hooks/use-admin-members";
import type { SetupLinkResult } from "@/features/admin-members/repositories/admin-members.repository";
import type { AdminMemberDetail } from "@/features/admin-members/types";

function errorMessageOf(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
  }
  return "Please try again.";
}

function expiryLabelOf(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/**
 * Support tool for members whose set-up email never arrived. Shows whether the
 * account has completed first-time set-up and, while it hasn't, lets an admin
 * re-send the invitation email or copy a fresh link to pass on directly.
 */
export function AccountSetupCard({ member }: { member: AdminMemberDetail }) {
  const { toast } = useToast();
  const { mutate: sendInvite, isPending: isSending } = useResendWelcomeEmail();
  const { mutate: createLink, isPending: isCreatingLink } = useCreateSetupLink();

  const [link, setLink] = useState<SetupLinkResult | null>(null);
  const [copied, setCopied] = useState(false);

  function handleSend() {
    sendInvite(member.id, {
      onSuccess: (result) => {
        if (result.sent) {
          toast({ variant: "success", title: "Invitation sent", description: `A new set-up link was emailed to ${result.email}.` });
        } else {
          toast({
            variant: "error",
            title: "Email couldn't be sent",
            description: "The mail server didn't accept it. Use \"Copy setup link\" to share it with the member directly.",
          });
        }
      },
      onError: (error) => toast({ variant: "error", title: "Couldn't send invitation", description: errorMessageOf(error) }),
    });
  }

  function handleCreateLink() {
    createLink(member.id, {
      onSuccess: (result) => {
        setCopied(false);
        setLink(result);
      },
      onError: (error) => toast({ variant: "error", title: "Couldn't create link", description: errorMessageOf(error) }),
    });
  }

  async function copyLink() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link.setupUrl);
      setCopied(true);
      toast({ variant: "success", title: "Link copied", description: "Paste it into a message to the member." });
    } catch {
      toast({ variant: "info", title: "Couldn't copy automatically", description: "Select the link and copy it manually." });
    }
  }

  return (
    <>
      <Card>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="font-display text-base font-semibold text-text-primary">Account Setup</h3>
          {member.setupPending ? (
            <Badge variant="warning">
              <Clock className="h-3 w-3" />
              Setup pending
            </Badge>
          ) : (
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3" />
              Set up
            </Badge>
          )}
        </div>

        {member.setupPending ? (
          <>
            <p className="text-sm text-text-secondary leading-relaxed">
              {member.fullName} hasn&apos;t created a password yet. If their invitation email didn&apos;t arrive, send it
              again, or copy the link and share it with them directly.
            </p>
            <div className="space-y-2.5 mt-4">
              <Button variant="secondary" className="w-full justify-start" disabled={isSending} onClick={handleSend}>
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send invitation email
              </Button>
              <Button variant="secondary" className="w-full justify-start" disabled={isCreatingLink} onClick={handleCreateLink}>
                {isCreatingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                Copy setup link
              </Button>
            </div>
            <p className="text-xs text-text-muted mt-3 leading-relaxed">
              Each link works once and expires after 24 hours. Creating a new one cancels any earlier link.
            </p>
          </>
        ) : (
          <p className="text-sm text-text-secondary leading-relaxed">
            This account is set up
            {member.lastLoginLabel ? ` — last signed in ${member.lastLoginLabel}` : ""}. If they can&apos;t sign in, they can
            use <span className="font-medium text-text-primary">Forgot password</span> on the sign-in page.
          </p>
        )}
      </Card>

      <Dialog open={link !== null} onOpenChange={(open) => !open && setLink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup link for {member.fullName}</DialogTitle>
            <DialogDescription>
              Send this to {link?.email}. It works once and expires {link ? expiryLabelOf(link.expiresAt) : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input readOnly value={link?.setupUrl ?? ""} onFocus={(e) => e.currentTarget.select()} aria-label="Setup link" />
            <Button onClick={copyLink} className="shrink-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Treat this like a password: anyone holding the link can set the account&apos;s password. Share it only with the
            member. This is recorded in the audit log.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
