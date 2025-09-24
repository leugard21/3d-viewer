"use client";
import * as React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: React.ReactNode;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  actions?: React.ReactNode; // optional right-side controls
  children: React.ReactNode;
};

export function CollapsibleSection({ title, open, onOpenChange, actions, children }: Props) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="w-full">
      <div className="flex items-center justify-between px-3 py-2">
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-2 text-sm font-semibold">
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", open ? "rotate-0" : "-rotate-90")}
            />
            {title}
          </button>
        </CollapsibleTrigger>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      <CollapsibleContent className="data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
