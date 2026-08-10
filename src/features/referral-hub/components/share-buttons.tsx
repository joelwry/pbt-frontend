function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.2 14.15c-.22.62-1.28 1.19-1.77 1.24-.45.05-.94.24-3.14-.65-2.66-1.08-4.35-3.8-4.48-3.97-.13-.17-1.08-1.43-1.08-2.73 0-1.3.68-1.93.93-2.2.24-.26.53-.32.7-.32.18 0 .35 0 .5.01.16.01.38-.06.6.45.22.53.75 1.83.81 1.96.06.13.1.29.02.46-.09.17-.13.28-.26.43-.13.15-.27.34-.39.46-.13.13-.26.27-.11.53.15.26.66 1.09 1.42 1.76.98.87 1.8 1.14 2.06 1.27.26.13.41.11.56-.07.15-.17.65-.76.82-1.02.17-.26.34-.22.57-.13.24.09 1.51.71 1.77.84.26.13.43.19.5.3.06.11.06.63-.16 1.25z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.3-1.5 1.6-1.5H16.5V4.3C16.2 4.3 15.2 4 14 4c-2.4 0-4 1.5-4 4.1v2.4H7.5v3H10V21h3.5z" />
    </svg>
  );
}

/** Google's real 4-color "G" -- reads as "this opens in Gmail," which is the point. */
function GmailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="#4285F4" d="M22 6.5v11a2 2 0 0 1-2 2h-1.5V9.6l-6.5 4.9-6.5-4.9v9.9H4a2 2 0 0 1-2-2v-11" />
      <path fill="#EA4335" d="M4 4.5h16a2 2 0 0 1 1.64.86L12 12 2.36 5.36A2 2 0 0 1 4 4.5z" />
      <path fill="#34A853" d="M2 6.5v11a2 2 0 0 0 2 2h1.5V9.6l-3.13-2.36A1.98 1.98 0 0 0 2 6.5z" />
      <path fill="#FBBC05" d="M22 6.5c0-.75-.33-1.4-.87-1.86L18.5 6.5V19h1.5a2 2 0 0 0 2-2v-11z" />
    </svg>
  );
}

/**
 * Each button carries its own platform's brand color and icon, per direct
 * feedback -- "let those share carry the feel of the platform they are
 * sharing to." Generic secondary-button styling reads as one undifferentiated
 * "share" action instead of three distinct, recognizable destinations.
 */
export function ShareButtons({
  onEmail,
  onWhatsApp,
  onFacebook,
}: {
  onEmail: () => void;
  onWhatsApp: () => void;
  onFacebook: () => void;
}) {
  return (
    <div className="flex items-center gap-3 mt-4 flex-wrap">
      <button
        onClick={onWhatsApp}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#25D366" }}
      >
        <WhatsAppIcon className="h-4 w-4" />
        Share via WhatsApp
      </button>
      <button
        onClick={onFacebook}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#1877F2" }}
      >
        <FacebookIcon className="h-4 w-4" />
        Share on Facebook
      </button>
      <button
        onClick={onEmail}
        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-text-primary border border-border transition-colors hover:bg-[#F5F8FA]"
      >
        <GmailIcon className="h-4 w-4" />
        Share via Email
      </button>
    </div>
  );
}
