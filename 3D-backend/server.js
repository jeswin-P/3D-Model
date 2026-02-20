import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./db.js";
import routes from './routes/router.js';
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();

// CORS — allow flexible origins via env or fallbacks
// CORS — allow flexible origins via env or fallbacks
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Check against allowed origins list
    const isAllowed = allowedOrigins.includes(origin);

    // Check if it's a Vercel preview deployment or localhost
    const isVercel = origin.endsWith(".vercel.app");
    const isLocalhost = origin.startsWith("http://localhost:");

    if (isAllowed || isVercel || isLocalhost) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Serve uploads folder
// Use absolute path for uploads to ensure consistency
// GridFS is used for storage, so local static file serving is no longer primary
// but we can keep the route for debugging or health checks
app.get("/", (req, res) => res.send("Backend is running with GridFS ✅"));

// Use your router
app.use('/', routes);

// Optional root test route
app.get("/", (req, res) => res.send("Backend is running ✅"));

// Debug all incoming requests (catch-all for unhandled routes)
app.all(/(.*)/, (req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

