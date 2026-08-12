/**
 * Email helper — currently logs to console only.
 * Swap the `send()` implementation for Nodemailer / Resend when you have credentials.
 */

export interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  packageSlug?: string;
  message: string;
  enquiryId: string;
}

export interface CustomRequestPayload {
  name: string;
  email: string;
  phone?: string;
  groupType: string;
  travellers: number;
  requestId: string;
}

async function send(to: string, subject: string, text: string): Promise<void> {
  // TODO: replace with actual email transport (Nodemailer, Resend, etc.)
  console.log(`[email] TO=${to} | SUBJECT=${subject}\n${text}`);
}

/**
 * Auto-acknowledgement to the person who submitted the enquiry.
 * Must never throw — email failure must not block the form response.
 */
export async function sendEnquiryAck(payload: EnquiryPayload): Promise<void> {
  try {
    await send(
      payload.email,
      "We received your enquiry — SafarXGlobal",
      `Assalamu alaikum ${payload.name},\n\nThank you for reaching out. We have received your enquiry (ref: ${payload.enquiryId}) and a member of our team will reply within 24 hours.\n\nJazakAllah khair,\nThe SafarXGlobal Team`,
    );
  } catch (err) {
    console.error("[email] sendEnquiryAck failed", err);
  }
}

/**
 * Internal notification to the sales inbox.
 */
export async function sendEnquiryNotification(payload: EnquiryPayload): Promise<void> {
  const salesInbox = process.env.SALES_EMAIL || process.env.EMAIL_FROM || "sales@safarxglobal.com";
  try {
    await send(
      salesInbox,
      `New enquiry from ${payload.name} (${payload.email})`,
      `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || "—"}\nCountry: ${payload.country || "—"}\nPackage: ${payload.packageSlug || "—"}\nMessage:\n${payload.message}\n\nRef: ${payload.enquiryId}`,
    );
  } catch (err) {
    console.error("[email] sendEnquiryNotification failed", err);
  }
}

/**
 * Internal notification for custom package requests.
 */
export async function sendCustomRequestNotification(payload: CustomRequestPayload): Promise<void> {
  const salesInbox = process.env.SALES_EMAIL || process.env.EMAIL_FROM || "sales@safarxglobal.com";
  const priority = payload.travellers > 25 ? "[LARGE GROUP] " : "";
  try {
    await send(
      salesInbox,
      `${priority}Custom package request from ${payload.name}`,
      `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || "—"}\nGroup type: ${payload.groupType}\nTravellers: ${payload.travellers}\n\nRef: ${payload.requestId}`,
    );
  } catch (err) {
    console.error("[email] sendCustomRequestNotification failed", err);
  }
}

/**
 * Booking confirmation email.
 */
export async function sendBookingConfirmation(opts: {
  leadEmail: string;
  leadName: string;
  reference: string;
  packageSlug: string;
  priceQuote: number;
}): Promise<void> {
  try {
    await send(
      opts.leadEmail,
      `Booking confirmed — ${opts.reference} | SafarXGlobal`,
      `Assalamu alaikum ${opts.leadName},\n\nYour booking (${opts.reference}) for ${opts.packageSlug} has been confirmed.\n\nTotal paid: ₹${opts.priceQuote.toLocaleString("en-IN")}\n\nWe will be in touch shortly with your full travel documents.\n\nJazakAllah khair,\nThe SafarXGlobal Team`,
    );
  } catch (err) {
    console.error("[email] sendBookingConfirmation failed", err);
  }
}
