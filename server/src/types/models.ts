import { Document } from "mongoose";

export interface EnquiryDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  packageSlug?: string;
  message: string;
  source?: string;
  honeypot?: string;
  suspicious: boolean;
  notifyStatus: "pending" | "sent" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

export interface PackageDocument extends Document {
  slug: string;
  title: string;
  description: string;
  published: boolean;
  fromPriceInr: number;
  durationDays: number;
  hotelDistance: string;
  packageType: string;
  nights: number;
  inclusions: string[];
  exclusions: string[];
  faq: { question: string; answer: string; pending?: boolean }[];
  gallery: string[];
  departures: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DepartureDocument extends Document {
  packageSlug: string;
  date: Date;
  seatsTotal: number;
  seatsRemaining: number;
  priceInr: number;
  status: "available" | "sold_out" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingDocument extends Document {
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
  status: "draft" | "confirmed" | "cancelled";
  priceQuote: number;
  reference: string;
  idempotencyKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingTravellerDocument extends Document {
  bookingId: string;
  name: string;
  dob: Date;
  gender: string;
  passportNumber: string;
  passportExpiry: Date;
  nationality: string;
  mahramRelation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExchangeRateDocument extends Document {
  rates: Record<string, number>;
  fetchedAt: Date;
  stale: boolean;
}
