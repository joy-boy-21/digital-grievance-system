import "dotenv/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import grievanceRoutes from "./routes/grievanceRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// middleware
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true
  })
);
app.use(morgan("dev"));

// health
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

//api check
app.get("/", (req, res) => {
  res.send("🚀 Digital Grievance API is running!");
});

app.get("/favicon.ico", (req, res) => res.status(204));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/grievances", grievanceRoutes);

// errors
app.use(notFound);
app.use(errorHandler);

// start
const PORT = process.env.PORT || 8080;
const URI = process.env.MONGODB_URI;

connectDB(URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`));
});

app.get('/', (req, res) => {
  res.send('🚀 Digital Grievance API is running!');
});

app.get('/favicon.ico', (req, res) => res.status(204));


