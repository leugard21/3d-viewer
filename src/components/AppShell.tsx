"use client";

import { cn } from "@/lib/utils";

type Props = {
  topBar: React.ReactNode;
  sidebar: React.ReactNode;
  viewport: React.ReactNode;
};

export function AppShell({ topBar, sidebar, viewport }: Props) {
  return (
    <div className="flex h-dvh w-dvw flex-col">
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-12 max-w-screen-2xl items-center px-2">
          {topBar}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "w-80 shrink-0 border-r bg-muted/30",
            "min-h-0 overflow-hidden"
          )}
          aria-label="sidebar"
        >
          {sidebar}
        </aside>

        <main className="min-w-0 flex-1">{viewport}</main>
      </div>
    </div>
  );
}
