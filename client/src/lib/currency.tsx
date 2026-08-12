import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";

export type CurrencyCode = "INR" | "USD" | "GBP" | "SAR";

/**
 * Indicative rates against 1 INR. These are display-only conversions so that a
 * global audience can read our prices — update them periodically. All bookings
 * are invoiced in INR.
 *
 * These defaults are overwritten by live rates fetched from /api/public/exchange-rates.
 */
const DEFAULT_PER_INR: Record<CurrencyCode, number> = {
  INR: 1,
  USD: 0.0115,
  GBP: 0.009,
  SAR: 0.043,
};

export const currencies: Record<
  CurrencyCode,
  { symbol: string; label: string; perInr: number; locale: string }
> = {
  INR: { symbol: "₹", label: "INR", perInr: DEFAULT_PER_INR.INR, locale: "en-IN" },
  USD: { symbol: "$", label: "USD", perInr: DEFAULT_PER_INR.USD, locale: "en-US" },
  GBP: { symbol: "£", label: "GBP", perInr: DEFAULT_PER_INR.GBP, locale: "en-GB" },
  SAR: { symbol: "SR ", label: "SAR", perInr: DEFAULT_PER_INR.SAR, locale: "en-US" },
};

export const currencyCodes = Object.keys(currencies) as CurrencyCode[];

export function formatPrice(amountInr: number, code: CurrencyCode) {
  const { symbol, perInr, locale } = currencies[code];
  const converted = amountInr * perInr;
  const rounded = code === "INR" ? converted : Math.round(converted / 5) * 5;
  return `${symbol}${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(rounded)}`;
}

const STORAGE_KEY = "sxg-currency";

const CurrencyContext = createContext<{
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  ratesStale: boolean;
}>({ currency: "INR", setCurrency: () => {}, ratesStale: false });

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [ratesStale, setRatesStale] = useState(false);

  useEffect(() => {
    // Restore persisted currency preference
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && stored in currencies) setCurrency(stored as CurrencyCode);

    // Fetch live exchange rates from the backend
    api.exchangeRates
      .get()
      .then(({ data }) => {
        const { rates, stale } = data;
        setRatesStale(stale);

        // Update the mutable perInr values in the currencies object
        for (const code of currencyCodes) {
          const serverRate = rates[code];
          if (typeof serverRate === "number" && serverRate > 0) {
            currencies[code].perInr = serverRate;
          }
        }
      })
      .catch((err) => {
        // Fall back silently to hardcoded rates
        console.warn("[currency] Failed to fetch live rates, using defaults:", err);
        setRatesStale(true);
      });
  }, []);

  const value = useMemo(
    () => ({
      currency,
      setCurrency: (code: CurrencyCode) => {
        setCurrency(code);
        window.localStorage.setItem(STORAGE_KEY, code);
      },
      ratesStale,
    }),
    [currency, ratesStale],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

/** Price formatted in the reader's selected currency. */
export function usePrice(amountInr: number) {
  const { currency } = useCurrency();
  return formatPrice(amountInr, currency);
}

/** Inline price in the reader's selected currency — safe to use inside loops. */
export function Price({ inr }: { inr: number }) {
  return <>{usePrice(inr)}</>;
}   
