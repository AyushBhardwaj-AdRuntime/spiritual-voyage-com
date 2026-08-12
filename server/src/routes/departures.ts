import { Router } from "express";
import { DepartureModel, BookingModel } from "../models";

export const departureRouter = Router();

departureRouter.get("/", async (req, res) => {
  const packageSlug = String(req.query.packageSlug || "").trim();
  if (!packageSlug) {
    return res.status(422).json({ ok: false, error: "packageSlug is required" });
  }

  // Return ALL future departures including sold_out (so UI can show "Sold Out" badge)
  const now = new Date();
  const departures = await DepartureModel.find({
    packageSlug,
    date: { $gte: now },
  })
    .sort({ date: 1 })
    .lean()
    .exec();

  // Compute real seatsRemaining from confirmed bookings for each departure
  const results = await Promise.all(
    departures.map(async (dep) => {
      const confirmedBookings = await BookingModel.aggregate([
        {
          $match: {
            departureId: dep._id.toString(),
            status: { $in: ["confirmed", "draft"] }, // draft holds a seat temporarily
          },
        },
        { $group: { _id: null, totalTravellers: { $sum: "$travellers" } } },
      ]);

      const occupied = confirmedBookings[0]?.totalTravellers ?? 0;
      const seatsRemaining = Math.max(0, dep.seatsTotal - occupied);
      const computedStatus: "available" | "sold_out" | "closed" =
        dep.status === "closed" ? "closed" : seatsRemaining === 0 ? "sold_out" : "available";

      return {
        id: dep._id,
        packageSlug: dep.packageSlug,
        date: dep.date,
        seatsTotal: dep.seatsTotal,
        seatsRemaining,
        priceInr: dep.priceInr,
        status: computedStatus,
      };
    }),
  );

  return res.json({ ok: true, data: results });
});
