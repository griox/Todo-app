import { configDotenv } from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "../src/config/db.js";

configDotenv({ quiet: true });

try {
  const connection = await connectDB();
  const { host, name } = connection.connection;

  console.log(`MongoDB initialized: ${name} on ${host}`);
} catch (error) {
  console.error(`MongoDB initialization failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
