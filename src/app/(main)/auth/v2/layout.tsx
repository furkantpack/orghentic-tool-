import type { ReactNode } from "react";

import { Network } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid min-h-dvh justify-center bg-background p-2 lg:grid-cols-2">
        <div className="relative order-2 hidden h-full overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_20%_15%,rgba(14,165,233,0.20),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(139,92,246,0.20),transparent_30%),linear-gradient(135deg,#f8fbff_0%,#eef8ff_48%,#f7f3ff_100%)] lg:flex">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[length:9px_9px] bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.12)_1px,transparent_1px)] opacity-30" />
          <div className="relative flex w-full flex-col justify-between p-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl border bg-background/80 text-sky-700 shadow-xs backdrop-blur">
                  <Network className="size-5" />
                </div>
                <div>
                  <h1 className="font-semibold text-2xl tracking-tight">Orgentic</h1>
                  <p className="text-muted-foreground text-sm">Organization intelligence for humans and agents.</p>
                </div>
              </div>
              <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                Workspace ready in minutes
              </Badge>
            </div>

            <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr]">
              <div className="space-y-1">
                <h2 className="font-medium">Start your workspace</h2>
                <p className="text-muted-foreground text-sm">
                  Map teams, agents, tasks, and costs without spreadsheet drift or manual status chasing.
                </p>
              </div>
              <Separator orientation="vertical" className="hidden h-auto md:block" />
              <div className="space-y-1">
                <h2 className="font-medium">Need guidance?</h2>
                <p className="text-muted-foreground text-sm">
                  Use templates for org charts, finance scenarios, users, tasks, and agent marketplace setup.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex min-h-[calc(100dvh-1rem)]">{children}</div>
      </div>
    </main>
  );
}
