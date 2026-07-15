import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { uploadsDir } from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ===============================
// DATABASE CONNECTION
// ===============================

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:5173",
  "https://dfrontend-sigma.vercel.app",
  ...(process.env.CORS_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ===============================
// BODY PARSER MIDDLEWARE
// ===============================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ===============================
// COOKIE PARSER
// ===============================

app.use(cookieParser());

// ===============================
// API ROUTES
// ===============================

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

// ===============================
// PAYPAL CONFIG
// ===============================

app.get("/api/config/paypal", (req, res) => {
  res.send({
    clientId: process.env.PAYPAL_CLIENT_ID,
  });
});

// ===============================
// UPLOAD STATIC FOLDER
// ===============================

app.use(
  "/uploads",
  express.static(uploadsDir)
);

// ===============================
// TEST API
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running successfully...",
  });
});

// ===============================
// ERROR MIDDLEWARE
// ===============================

app.use(notFound);
app.use(errorHandler);

// ===============================
// LOCAL SERVER
// ===============================

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// ===============================
// VERCEL EXPORT
// ===============================

export default app;
