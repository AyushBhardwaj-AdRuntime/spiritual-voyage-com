import mongoose from "mongoose";

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  const connection = await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || "safarxglobal",
  });

  console.log(`Connected to MongoDB: ${connection.connection.host}`);
  return connection;
}
