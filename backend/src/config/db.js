import mongoose from "mongoose";
import Task from "../models/Tasks.js";

export const connectDB = async ({
  env = process.env,
  mongooseClient = mongoose,
  taskModel = Task,
} = {}) => {
  const mongoUri = env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is required to connect to MongoDB");
  }

  const databaseName = new URL(mongoUri).pathname.replace("/", "");

  if (!databaseName) {
    throw new Error("MONGODB_URI must include a database name, for example mongodb+srv://user:password@cluster.mongodb.net/todoapp");
  }

  const connection = await mongooseClient.connect(mongoUri);
  await taskModel.init();

  return connection;
};
