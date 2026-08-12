import { Router } from "express";
import { packageQuerySchema, slugParamSchema } from "../../lib/validators";
import { PackageModel, DepartureModel } from "../../models";

export const packageRouter = Router();

packageRouter.get("/", async (req, res) => {
  const parse = packageQuerySchema.safeParse(req.query);
  if (!parse.success) {
    return res.status(422).json({ ok: false, errors: parse.error.flatten().fieldErrors });
  }

  const { type, nights, sort, page, limit } = parse.data;
  const query: Record<string, unknown> = { published: true };
  if (type) query.packageType = type;
  if (nights) query.nights = Number(nights);

  const pageNumber = Number(page ?? 1);
  const pageSize = Math.min(Number(limit ?? 12), 48);

  const total = await PackageModel.countDocuments(query).exec();
  const packages = await PackageModel.find(query)
    .sort(sort === "price" ? { fromPriceInr: 1 } : sort === "duration" ? { durationDays: 1 } : {})
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .lean()
    .exec();

  return res.json({ ok: true, data: packages, total, page: pageNumber, limit: pageSize });
});

packageRouter.get("/:slug", async (req, res) => {
  const parse = slugParamSchema.safeParse(req.params);
  if (!parse.success) {
    return res.status(422).json({ ok: false, errors: parse.error.flatten().fieldErrors });
  }

  const pkg = await PackageModel.findOne({ slug: parse.data.slug, published: true }).lean().exec();
  if (!pkg) {
    return res.status(404).json({ ok: false, error: "Package not found" });
  }

  const departures = await DepartureModel.find({ packageSlug: pkg.slug, date: { $gte: new Date() } }).lean().exec();
  return res.json({ ok: true, data: { ...pkg, departures } });
});
