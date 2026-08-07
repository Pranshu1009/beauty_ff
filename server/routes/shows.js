import { Router } from "express";
import ShowItem from "../models/ShowItem.js";
import { requireAuth } from "../middleware/auth.js";
import { DEFAULT_SHOWS } from "../seedData.js";

const router = Router();

function normalizeImages(doc) {
  if (Array.isArray(doc.images) && doc.images.length) {
    return doc.images.filter(Boolean);
  }
  if (doc.image) return [doc.image];
  return [];
}

function mapItem(doc) {
  const images = normalizeImages(doc);
  return {
    id: String(doc._id),
    title: doc.title,
    subtitle: doc.subtitle || "",
    image: images[0] || "",
    images,
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

router.get("/:id", async (req, res) => {
  try {
    const item = await ShowItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Show not found." });
    res.json({ item: mapItem(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load show." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const title = String(req.body.title || "").trim() || "Untitled";
    const subtitle = String(req.body.subtitle || "").trim();
    const single = String(req.body.image || "");
    const list = Array.isArray(req.body.images)
      ? req.body.images.map(String).filter(Boolean)
      : [];
    const images = list.length ? list : single ? [single] : [];

    if (!images.length) {
      return res.status(400).json({ message: "At least one image is required." });
    }

    const item = await ShowItem.create({ title, subtitle, images });
    res.status(201).json({ item: mapItem(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not add show." });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const item = await ShowItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Show not found." });

    if (req.body.title != null) {
      item.title = String(req.body.title).trim() || "Untitled";
    }
    if (req.body.subtitle != null) {
      item.subtitle = String(req.body.subtitle).trim();
    }
    if (Array.isArray(req.body.images) && req.body.images.length) {
      item.images = req.body.images.map(String).filter(Boolean);
    }

    // Ensure images array exists for legacy docs
    if (!item.images?.length && item.image) {
      item.images = [item.image];
      item.set("image", undefined);
    }

    await item.save();
    res.json({ item: mapItem(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update show." });
  }
});

router.post("/:id/images", requireAuth, async (req, res) => {
  try {
    const item = await ShowItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Show not found." });

    const image = String(req.body.image || "");
    if (!image) {
      return res.status(400).json({ message: "Image is required." });
    }

    if (!Array.isArray(item.images) || !item.images.length) {
      item.images = item.image ? [item.image] : [];
    }
    item.images.push(image);
    item.set("image", undefined);
    await item.save();
    res.status(201).json({ item: mapItem(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not add photo." });
  }
});

router.delete("/:id/images/:index", requireAuth, async (req, res) => {
  try {
    const item = await ShowItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Show not found." });

    const images =
      Array.isArray(item.images) && item.images.length
        ? [...item.images]
        : item.image
          ? [item.image]
          : [];
    const index = Number(req.params.index);

    if (!Number.isInteger(index) || index < 0 || index >= images.length) {
      return res.status(400).json({ message: "Invalid photo index." });
    }
    if (images.length <= 1) {
      return res
        .status(400)
        .json({ message: "A show must keep at least one photo." });
    }

    images.splice(index, 1);
    item.images = images;
    item.set("image", undefined);
    await item.save();
    res.json({ item: mapItem(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete photo." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await ShowItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Show not found." });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete show." });
  }
});

export default router;
