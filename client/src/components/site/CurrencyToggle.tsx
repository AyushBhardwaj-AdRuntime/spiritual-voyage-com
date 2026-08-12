import { currencyCodes, currencies, useCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={cn("flex items-center", className)}>
      <label htmlFor="currency" className="sr-only">
        Display currency
      </label>
      <select
        id="currency"
        value={currency}
        onChange={(event) => setCurrency(event.target.value as typeof currency)}
        className="h-8 border border-cream/25 bg-transparent px-2 text-[0.65rem] tracking-[0.16em] text-cream/80 uppercase focus:border-gold focus:outline-none"
      >
        {currencyCodes.map((code) => (
          <option key={code} value={code} className="text-foreground">
            {currencies[code].label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CurrencyNote({ className }: { className?: string }) {
  const { currency } = useCurrency();
  if (currency === "INR") return null;
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      Approximate conversion shown for guidance. All bookings are invoiced in INR.
    </p>
  );
}
