import { Router } from "express";
import { customRequestSchema } from "../../lib/validators";
import { CustomRequestModel } from "../../models";
import { sendCustomRequestNotification } from "../../lib/email";

export const customRequestRouter = Router();

/** Escape HTML to prevent injection in notification emails */
function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

customRequestRouter.post("/", async (req, res) => {
  const parse = customRequestSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(422).json({ ok: false, errors: parse.error.flatten().fieldErrors });
  }

  const data = parse.data;

  // ── Persist ───────────────────────────────────────────────────────────────
  const created = await CustomRequestModel.create({
    name: data.name,
    email: data.email,
    phone: data.phone ?? undefined,
    departureCity: data.departureCity ?? undefined,
    groupType: data.groupType,
    travellers: data.travellers,
    // HTML-escape free-text fields before storage to prevent injection in emails
    dates: escapeHtml(data.dates),
    nights: escapeHtml(data.nights),
    budget: escapeHtml(data.budget),
    rooms: data.rooms,
    needs: escapeHtml(data.needs),
  });

  const requestId = created.id as string;
  const isLargeGroup = data.travellers > 25;

  // ── Fire-and-forget notification ──────────────────────────────────────────
  void sendCustomRequestNotification({
    name: data.name,
    email: data.email,
    phone: data.phone ?? undefined,
    groupType: data.groupType,
    travellers: data.travellers,
    requestId,
  });

  return res.json({
    ok: true,
    requestId,
    largeGroup: isLargeGroup,
    message: isLargeGroup
      ? "Your large group request has been flagged for priority handling."
      : "Your request has been received.",
  });
});
