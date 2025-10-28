import express from 'express';
import taskRouters from './src/routes/taskRouters.js';
import { connectDB } from './src/config/db.js';
import { configDotenv } from 'dotenv';
import cors from 'cors';
configDotenv()
const Port = process.env.PORT || 5001;
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/api/tasks", taskRouters);
connectDB().then(() => {
  console.log("Connected to the database");
  app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
}).catch((error) => {
  console.error("Database connection error:", error);
});



