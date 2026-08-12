import { Lock, ShieldCheck } from "lucide-react";

import { paymentSecurity } from "@/data/legal";
import { cn } from "@/lib/utils";

/** UI slot for the eventual payment step. Payment logic is not wired yet. */
export function SecurityNote({ className }: { className?: string }) {
  return (
    <div className={cn("border border-border bg-card p-6", className)}>
      <p className="flex items-center gap-2 text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase">
        <Lock className="size-3.5 text-gold" aria-hidden />
        Secure payment
      </p>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        <li className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
          {paymentSecurity.encryptionNote}
        </li>
        <li className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
          {paymentSecurity.processorNote}
        </li>
        <li className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
          {paymentSecurity.storageNote}
        </li>
      </ul>
      <p className="mt-4 text-xs text-muted-foreground italic">{paymentSecurity.status}</p>
    </div>
  );
}
