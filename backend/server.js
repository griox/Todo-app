import express from 'express';
import taskRouters from './src/routes/taskRouters.js';
import { connectDB } from './src/config/db.js';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import path from 'path';

configDotenv()
const Port = process.env.PORT || 5001;
const __dirname = path.resolve();
const app = express();
app.use(express.json());

if(process.env.NODE_ENV !== 'production'){
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use("/api/tasks", taskRouters);

if(process.env.NODE_ENV === 'production'){
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
}

connectDB().then(() => {
  console.log("Connected to the database");
  app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
}).catch((error) => {
  console.error("Database connection error:", error);
});



