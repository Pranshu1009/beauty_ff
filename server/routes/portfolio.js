import { Router } from "express";
import PortfolioItem, { CATEGORIES } from "../models/PortfolioItem.js";
import { requireAuth } from "../middleware/auth.js";
import { DEFAULT_PORTFOLIO } from "../seedData.js";

const router = Router();

function mapItem(doc) {
  return {
    id: String(doc._id),
    title: doc.title,
    category: doc.category,
    image: doc.image,
  };
}

router.get("/", async (_req, res) => {
  try {
    const items = await PortfolioItem.find().sort({ createdAt: -1 });
    res.json({ items: items.map(mapItem), categories: CATEGORIES });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load portfolio." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const title = String(req.body.title || "").trim() || "Untitled Look";
    const category = String(req.body.category || "");
    const image = String(req.body.image || "");

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Invalid category." });
    }
    if (!image) {
      return res.status(400).json({ message: "Image is required." });
    }

    const item = await PortfolioItem.create({ title, category, image });
    res.status(201).json({ item: mapItem(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not add photo." });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Photo not found." });

    if (req.body.title != null) {
      item.title = String(req.body.title).trim() || "Untitled Look";
    }
    if (req.body.category != null) {
      if (!CATEGORIES.includes(req.body.category)) {
        return res.status(400).json({ message: "Invalid category." });
      }
      item.category = req.body.category;
    }
    if (req.body.image != null) {
      item.image = String(req.body.image);
    }

    await item.save();
    res.json({ item: mapItem(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update photo." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await PortfolioItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Photo not found." });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete photo." });
  }
});

router.post("/reset", requireAuth, async (_req, res) => {
  try {
    await PortfolioItem.deleteMany({});
    await PortfolioItem.insertMany(DEFAULT_PORTFOLIO);
    const items = await PortfolioItem.find().sort({ createdAt: -1 });
    res.json({ items: items.map(mapItem) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not reset portfolio." });
  }
});

export default router;
