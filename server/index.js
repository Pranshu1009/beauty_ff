import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
import showRoutes from "./routes/shows.js";
import { seedDefaults } from "./seed.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "12mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Public site config (Web3Forms access keys are safe to expose client-side)
app.get("/api/config", (_req, res) => {
  res.json({
    web3formsAccessKey:
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.VITE_WEB3FORMS_ACCESS_KEY ||
      "",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/shows", showRoutes);

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB Atlas");
  await seedDefaults();

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
