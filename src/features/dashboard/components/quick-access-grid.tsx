import Link from "next/link";
import { GraduationCap, FolderOpen, Users, Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { QuickAccessTile } from "@/features/dashboard/types";

const ICONS = {
  learning: GraduationCap,
  resources: FolderOpen,
  community: Users,
  events: Ticket,
};

export function QuickAccessGrid({ tiles }: { tiles: QuickAccessTile[] }) {
  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-4">Quick Access</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((tile) => {
          const Icon = ICONS[tile.icon];
          return (
            <Link key={tile.id} href={tile.href}>
              <Card className="pbt-hover-lift h-full">
                <div className="h-10 w-10 rounded-xl bg-sky-tint text-sky-600 flex items-center justify-center mb-3">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <p className="font-semibold text-sm text-text-primary">{tile.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{tile.description}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
