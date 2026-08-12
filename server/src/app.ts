import express from "express";
import cors from "cors";
import helmet from "helmet";
import "express-async-errors";
import { enquiryRouter } from "./routes/enquiries";
import { customRequestRouter } from "./routes/customPackage";
import { packageRouter } from "./routes/packages";
import { departureRouter } from "./routes/departures";
import { bookingRouter } from "./routes/bookings";
import { publicRouter } from "./routes/public";
import { webhookRouter } from "./routes/api/public/webhooks";
import { cronRouter } from "./routes/api/public/cron";

const app = express();

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS: restrict to the configured frontend URL ────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

// ── Body parsing ─────────────────────────────────────────────────────────────
// NOTE: /api/public/webhooks/stripe uses raw body — must mount BEFORE express.json()
app.use("/api/public/webhooks", webhookRouter);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ ok: true, service: "SafarXGlobal API", version: "1.0.0" }));

app.use("/api/enquiries", enquiryRouter);
app.use("/api/custom-package", customRequestRouter);
app.use("/api/packages", packageRouter);
app.use("/api/departures", departureRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/public", publicRouter);
app.use("/api/public/cron", cronRouter);

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Don't expose stack traces to clients
  if (err instanceof Error) {
    if (err.name === "ValidationError" || err.name === "ZodError") {
      return res.status(422).json({ ok: false, error: err.message });
    }
    if (err.message?.startsWith("CORS:")) {
      return res.status(403).json({ ok: false, error: "CORS policy violation" });
    }
  }
  console.error("[server] Unhandled error:", err);
  return res.status(500).json({ ok: false, error: "Internal server error" });
});

export default app;
