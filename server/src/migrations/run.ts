import mongoose from "mongoose";
import connectDB from "../config/db";
import { runMigrations } from "./runner";

async function main() {
  try {
    await connectDB();

    await runMigrations();

    await mongoose.disconnect();

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed.");
    console.error(error);

    await mongoose.disconnect();

    process.exit(1);
  }
}

main();
