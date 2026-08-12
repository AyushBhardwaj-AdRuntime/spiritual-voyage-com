/**
 * Typed fetch client for the SafarXGlobal backend API.
 * All components should import from here — never call fetch() directly.
 */

const BASE_URL: string =
  (import.meta.env["VITE_API_URL"] as string | undefined) ?? "";

// ── Generic helpers ──────────────────────────────────────────────────────────

interface ApiError {
  ok: false;
  error?: string;
  errors?: Record<string, string[]>;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly payload: ApiError,
  ) {
    super(payload.error ?? `API error ${status}`);
    this.name = "ApiRequestError";
  }

  get fieldErrors(): Record<string, string[]> {
    return this.payload.errors ?? {};
  }

  get firstFieldError(): string | undefined {
    const errs = Object.values(this.fieldErrors).flat();
    return errs[0];
  }
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  path: string,
  options?: {
    body?: unknown;
    query?: Record<string, string | number | boolean | null | undefined>;
  },
): Promise<T> {
  let url = `${BASE_URL}${path}`;

  if (options?.query) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(options.query)) {
      if (v != null && v !== "") params.append(k, String(v));
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (options?.body != null) {
    headers["Content-Type"] = "application/json";
  }

  const init: RequestInit = {
    method,
    headers,
  };
  if (options?.body != null) {
    init.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, init);

  const json = await res.json().catch(() => ({ ok: false, error: "Invalid JSON response" }));

  if (!res.ok) {
    throw new ApiRequestError(res.status, json as ApiError);
  }

  return json as T;
}

const get = <T>(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>,
) => request<T>("GET", path, query ? { query } : undefined);

const post = <T>(path: string, body?: unknown) => request<T>("POST", path, { body });

// ── Types ────────────────────────────────────────────────────────────────────

export interface Departure {
  id: string;
  packageSlug: string;
  date: string;
  seatsTotal: number;
  seatsRemaining: number;
  priceInr: number;
  status: "available" | "sold_out" | "closed";
}

export interface Booking {
  id: string;
  reference: string;
  packageSlug: string;
  departureId: string;
  travellers: number;
  leadName: string;
  leadEmail: string;
  leadCountry: string;
  status: "draft" | "confirmed" | "cancelled";
  priceQuote: number;
  roomPreference?: string;
  departMonth?: string;
  notes?: string;
  createdAt: string;
}

export interface ExchangeRates {
  rates: Record<string, number>;
  stale: boolean;
  fetchedAt: string | null;
  source?: string;
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string | null;
  pending: boolean;
}

// ── Helper: strip undefined values from optional params ──────────────────────

function clean<T extends Record<string, unknown>>(obj: T): T {
  const result = {} as T;
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  return result;
}

// ── API surface ──────────────────────────────────────────────────────────────

export const api = {
  /** 1. Enquiries */
  enquiry: {
    submit: (body: {
      name: string;
      email: string;
      phone?: string;
      country?: string;
      packageSlug?: string;
      message: string;
      honeypot?: string;
      submittedAt?: number;
    }) =>
      post<{ ok: true; enquiryId: string }>("/api/enquiries", clean(body)),
  },

  /** 2. Custom package request */
  customPackage: {
    submit: (body: {
      name: string;
      email: string;
      phone?: string;
      departureCity?: string;
      groupType: "family" | "friends" | "corporate" | "solo" | "other";
      travellers: number;
      dates?: string;
      nights?: string;
      budget?: string;
      rooms: "sharing" | "twin" | "triple" | "quad" | "private";
      needs?: string;
    }) =>
      post<{ ok: true; requestId: string; largeGroup: boolean; message: string }>(
        "/api/custom-package",
        clean(body),
      ),
  },

  /** 3. Packages */
  packages: {
    list: (query?: {
      type?: string;
      nights?: string;
      sort?: "price" | "duration";
      page?: number;
      limit?: number;
    }) =>
      get<{ ok: true; data: unknown[]; total: number; page: number; limit: number }>(
        "/api/packages",
        query as Record<string, string | number>,
      ),

    get: (slug: string) => get<{ ok: true; data: unknown }>(`/api/packages/${slug}`),
  },

  /** 4. Departures */
  departures: {
    list: (packageSlug: string) =>
      get<{ ok: true; data: Departure[] }>("/api/departures", { packageSlug }),
  },

  /** 5. Exchange rates */
  exchangeRates: {
    get: () => get<{ ok: true; data: ExchangeRates }>("/api/public/exchange-rates"),
  },

  /** 6. FAQs */
  faqs: {
    get: () => get<{ ok: true; data: FaqItem[] }>("/api/public/faqs"),
  },

  /** 7. Bookings */
  bookings: {
    createDraft: (body: {
      packageSlug: string;
      departureId: string;
      travellers: number;
      leadName: string;
      leadEmail: string;
      leadPhone: string;
      leadCountry: string;
      roomPreference?: string;
      departMonth?: string;
      notes?: string;
      idempotencyKey?: string;
    }) =>
      post<{
        ok: true;
        bookingId: string;
        reference: string;
        status: string;
        priceQuote: number;
      }>("/api/bookings/draft", clean(body)),

    addTravellers: (body: {
      bookingId: string;
      travellers: number;
      details: {
        name: string;
        dob: string;
        gender: "male" | "female" | "other";
        passportNumber: string;
        passportExpiry: string;
        nationality: string;
        mahramRelation?: string;
      }[];
    }) =>
      post<{
        ok: true;
        travellers: { id: string; name: string; passportNumber: string; nationality: string }[];
        warnings: string[];
      }>("/api/bookings/travellers", clean(body)),

    get: (reference: string, email: string) =>
      get<{ ok: true; booking: Booking }>("/api/bookings", { reference, email }),

    cancel: (body: { reference: string; email: string }) =>
      post<{
        ok: true;
        status: string;
        refund: {
          amountInr: number;
          tierLabel: string;
          nonRefundableAmountInr: number;
          note: string;
        };
      }>("/api/bookings/cancel", body),

    checkout: (body: { bookingId: string; mode: "deposit" | "full" }) =>
      post<{
        ok: true;
        checkoutUrl: string | null;
        reference: string;
        message?: string;
        priceQuote?: number;
      }>("/api/bookings/checkout", body),
  },
};
