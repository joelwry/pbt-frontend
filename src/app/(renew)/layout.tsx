import { RequireAuth } from "@/components/layout/require-auth";

export default function RenewLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
