import { Router } from "express";
import ShowItem from "../models/ShowItem.js";
import { requireAuth } from "../middleware/auth.js";
import { DEFAULT_SHOWS } from "../seedData.js";

const router = Router();

function mapItem(doc) {
  return {
    id: String(doc._id),
    title: doc.title,
    subtitle: doc.subtitle || "",
    image: doc.image,
  };
}

router.get("/", async (_req, res) => {
  try {
    const items = await ShowItem.find().sort({ createdAt: -1 });
    res.json({ items: items.map(mapItem) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load TV work." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const title = String(req.body.title || "").trim() || "Untitled";
    const subtitle = String(req.body.subtitle || "").trim();
    const image = String(req.body.image || "");

    if (!image) {
      return res.status(400).json({ message: "Image is required." });
    }

    const item = await ShowItem.create({ title, subtitle, image });
    res.status(201).json({ item: mapItem(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not add item." });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const item = await ShowItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });

    if (req.body.title != null) {
      item.title = String(req.body.title).trim() || "Untitled";
    }
    if (req.body.subtitle != null) {
      item.subtitle = String(req.body.subtitle).trim();
    }
    if (req.body.image != null) {
      item.image = String(req.body.image);
    }

    await item.save();
    res.json({ item: mapItem(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update item." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await ShowItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found." });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete item." });
  }
});

router.post("/reset", requireAuth, async (_req, res) => {
  try {
    await ShowItem.deleteMany({});
    await ShowItem.insertMany(DEFAULT_SHOWS);
    const items = await ShowItem.find().sort({ createdAt: -1 });
    res.json({ items: items.map(mapItem) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not reset TV work." });
  }
});

export default router;
