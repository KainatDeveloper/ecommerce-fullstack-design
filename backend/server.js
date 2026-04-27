import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import saveForLaterRoutes from "./routes/saveForLaterRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parser Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));

// Request Logging Middleware (Development)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// API ROUTES
// ============================================

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/saveForLater", saveForLaterRoutes);
app.use("/api/inquiry", inquiryRoutes);

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API is running...",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to E-commerce API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/product",
      cart: "/api/cart",
      saveForLater: "/api/saveForLater",
      health: "/health",
    },
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// 404 Handler - Must be before error handler
app.use(notFoundHandler);

// Global Error Handler - Must be last
app.use(errorHandler);

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║     E-Commerce Backend Server Started      ║
  ╠════════════════════════════════════════════╣
  ║  Environment: ${NODE_ENV.padEnd(32)}║
  ║  Port: ${PORT.toString().padEnd(38)}║
  ║  URL: http://localhost:${PORT.toString().padEnd(26)}║
  ╚════════════════════════════════════════════╝
  `);
});

// ============================================
// UNHANDLED PROMISE REJECTION HANDLER
// ============================================

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// ============================================
// UNCAUGHT EXCEPTION HANDLER
// ============================================

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
