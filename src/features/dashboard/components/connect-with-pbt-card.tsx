import { Card } from "@/components/ui/card";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.3-1.5 1.6-1.5H16.5V4.3C16.2 4.3 15.2 4 14 4c-2.4 0-4 1.5-4 4.1v2.4H7.5v3H10V21h3.5z" />
    </svg>
  );
}
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H4V20h2.94V8.5zM5.47 4a1.7 1.7 0 100 3.4 1.7 1.7 0 000-3.4zM20 20v-6.4c0-3.4-1.8-5-4.2-5-1.9 0-2.75 1.05-3.22 1.78V8.5H9.6c.04.86 0 11.5 0 11.5h2.94v-6.4c0-.34.03-.68.13-.93.29-.68.94-1.4 2.04-1.4 1.44 0 2.02 1.1 2.02 2.7V20H20z" />
    </svg>
  );
}
function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.6a2.7 2.7 0 00-1.9-1.9C18 5.2 12 5.2 12 5.2s-6 0-7.7.5A2.7 2.7 0 002.4 7.6 28 28 0 002 12a28 28 0 00.4 4.4 2.7 2.7 0 001.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 001.9-1.9A28 28 0 0022 12a28 28 0 00-.4-4.4zM10 15.2V8.8L15.5 12 10 15.2z" />
    </svg>
  );
}

const SOCIALS = [
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "#" },
  { icon: YoutubeIcon, label: "YouTube", href: "#" },
];

export function ConnectWithPbtCard() {
  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-text-primary">Connect With PBT</h3>
      <p className="text-sm text-text-muted mt-1.5">
        Follow us for updates, events and property insights.
      </p>
      <div className="flex items-center gap-2.5 mt-4">
        {SOCIALS.map((social) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className="h-9 w-9 rounded-full bg-[#F5F8FA] flex items-center justify-center text-text-secondary hover:bg-sky-tint hover:text-sky-600 transition-colors"
          >
            <social.icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </Card>
  );
}
