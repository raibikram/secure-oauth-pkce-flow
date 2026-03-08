import mongoose from "mongoose";
import { env } from "./env";


export default async function connectDB() {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected db successfully");
    });
    mongoose.connection.on("error", (e) => {
      console.log("Error in connection to database.", e);
    });
    await mongoose.connect(env.databaseUrl!);
  } catch (error) {
    console.log("Failed to connect to database.", error);
    process.exit(1);
  }
}