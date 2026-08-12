import mongoose from "mongoose";
import { EnquiryDocument, PackageDocument, DepartureDocument, BookingDocument, BookingTravellerDocument, ExchangeRateDocument } from "../types/models";

const enquirySchema = new mongoose.Schema<EnquiryDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 20 },
    country: { type: String, trim: true, maxlength: 60 },
    packageSlug: { type: String, trim: true, default: null },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    source: { type: String, trim: true, default: null },
    honeypot: { type: String, trim: true, default: null },
    suspicious: { type: Boolean, default: false },
    notifyStatus: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
  },
  { timestamps: true },
);

const packageSchema = new mongoose.Schema<PackageDocument>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    published: { type: Boolean, default: false },
    fromPriceInr: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    hotelDistance: { type: String, required: true },
    packageType: { type: String, required: true },
    nights: { type: Number, required: true },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    faq: { type: [{ question: String, answer: String, pending: Boolean }], default: [] },
    gallery: { type: [String], default: [] },
    departures: { type: [String], default: [] },
  },
  { timestamps: true },
);

const departureSchema = new mongoose.Schema<DepartureDocument>(
  {
    packageSlug: { type: String, required: true },
    date: { type: Date, required: true },
    seatsTotal: { type: Number, required: true },
    seatsRemaining: { type: Number, required: true },
    priceInr: { type: Number, required: true },
    status: { type: String, enum: ["available", "sold_out", "closed"], required: true },
  },
  { timestamps: true },
);

const bookingSchema = new mongoose.Schema<BookingDocument>(
  {
    packageSlug: { type: String, required: true },
    departureId: { type: String, required: true },
    travellers: { type: Number, required: true },
    leadName: { type: String, required: true },
    leadEmail: { type: String, required: true },
    leadPhone: { type: String, required: true },
    leadCountry: { type: String, required: true },
    roomPreference: { type: String, trim: true },
    departMonth: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: { type: String, enum: ["draft", "confirmed", "cancelled"], default: "draft" },
    priceQuote: { type: Number, required: true },
    reference: { type: String, required: true, unique: true },
    idempotencyKey: { type: String, index: true },
  },
  { timestamps: true },
);

const bookingTravellerSchema = new mongoose.Schema<BookingTravellerDocument>(
  {
    bookingId: { type: String, required: true },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    passportNumber: { type: String, required: true },
    passportExpiry: { type: Date, required: true },
    nationality: { type: String, required: true },
    mahramRelation: { type: String, trim: true },
  },
  { timestamps: true },
);

const exchangeRateSchema = new mongoose.Schema<ExchangeRateDocument>(
  {
    rates: { type: Map, of: Number, required: true },
    fetchedAt: { type: Date, required: true },
    stale: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const EnquiryModel = mongoose.models.Enquiry || mongoose.model<EnquiryDocument>("Enquiry", enquirySchema);
export const PackageModel = mongoose.models.Package || mongoose.model<PackageDocument>("Package", packageSchema);
export const DepartureModel = mongoose.models.Departure || mongoose.model<DepartureDocument>("Departure", departureSchema);
export const BookingModel = mongoose.models.Booking || mongoose.model<BookingDocument>("Booking", bookingSchema);
const customRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 20 },
    departureCity: { type: String, trim: true, maxlength: 100, default: null },
    groupType: { type: String, enum: ["family", "friends", "corporate", "solo", "other"], required: true },
    travellers: { type: Number, required: true },
    dates: { type: String, trim: true, maxlength: 500, default: null },
    nights: { type: String, trim: true, maxlength: 500, default: null },
    budget: { type: String, trim: true, maxlength: 500, default: null },
    rooms: { type: String, enum: ["sharing", "twin", "triple", "quad", "private"], required: true },
    needs: { type: String, trim: true, maxlength: 3000, default: null },
  },
  { timestamps: true },
);

export const CustomRequestModel = mongoose.models.CustomRequest || mongoose.model("CustomRequest", customRequestSchema);
export const BookingTravellerModel = mongoose.models.BookingTraveller || mongoose.model<BookingTravellerDocument>("BookingTraveller", bookingTravellerSchema);
export const ExchangeRateModel = mongoose.models.ExchangeRate || mongoose.model<ExchangeRateDocument>("ExchangeRate", exchangeRateSchema);
