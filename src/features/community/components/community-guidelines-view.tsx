import { ShieldCheck, MessageCircleHeart, Ban, Flag, Handshake, Lock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

const SECTIONS = [
  {
    icon: Handshake,
    title: "Be respectful and constructive",
    body: "This is a space for property business owners to learn from each other. Disagree with ideas, not people, and keep feedback constructive.",
  },
  {
    icon: MessageCircleHeart,
    title: "Stay on topic",
    body: "Keep discussions relevant to property, business growth, and the PBT curriculum. Off-topic threads make it harder for members to find what they need.",
  },
  {
    icon: Ban,
    title: "No spam or external promotion",
    body: "Don't use the Community Group to advertise unrelated products, services, or other communities. Genuine recommendations within a relevant discussion are fine.",
  },
  {
    icon: Lock,
    title: "Respect confidentiality",
    body: "Details shared by other members about their deals, finances, or businesses are shared in confidence. Don't repost or screenshot member content outside PBT.",
  },
  {
    icon: Flag,
    title: "Report, don't retaliate",
    body: "If you see something that breaks these guidelines, use the Report action on the post rather than responding in kind. The PBT team reviews every report.",
  },
  {
    icon: ShieldCheck,
    title: "Moderation",
    body: "The PBT team may remove posts or replies that break these guidelines, and may restrict access to the Community Group for repeated or serious violations.",
  },
];

export function CommunityGuidelinesView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Community Guidelines"
        description="A few simple rules to keep the PBT Community Group useful and welcoming for everyone."
        backHref="/community"
        backLabel="Back to Community Group"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map((section) => (
          <Card key={section.title} className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-sky-tint text-sky-600 flex items-center justify-center shrink-0">
              <section.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">{section.title}</p>
              <p className="text-sm text-text-muted mt-1 leading-relaxed">{section.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
