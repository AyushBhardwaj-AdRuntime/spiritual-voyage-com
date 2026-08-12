import "dotenv/config";
import app from "./app";
import { connectDb } from "./lib/db";

const port = Number(process.env.PORT || 4000);

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`SafarXGlobal backend listening on http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Failed to connect to MongoDB", error);
  process.exit(1);
});
