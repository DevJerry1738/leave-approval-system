"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <div aria-hidden={!open} className={open ? "fixed inset-0 z-50 flex items-center justify-center" : "hidden"}>
      <div className="fixed inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-background rounded-lg shadow-lg overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-b">{children}</div>;
}

function DialogBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("py-4", className)}>{children}</div>;
}

function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-t flex justify-end gap-3">{children}</div>;
}

export { Dialog, DialogHeader, DialogBody, DialogFooter };
