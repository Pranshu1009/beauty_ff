import { Router } from "express";
import AcademyImage from "../models/AcademyImage.js";
import { requireAuth } from "../middleware/auth.js";
import { DEFAULT_ACADEMY_GALLERY } from "../seedData.js";

const router = Router();

function mapItem(doc) {
  return {
    id: String(doc._id),
    image: doc.image,
    alt: doc.alt || "",
  };
}

router.get("/", async (_req, res) => {
  try {
    const items = await AcademyImage.find().sort({ createdAt: -1 });
    res.json({ items: items.map(mapItem) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load academy gallery." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const image = String(req.body.image || "");
    const alt = String(req.body.alt || "").trim();

    if (!image) {
      return res.status(400).json({ message: "Photo is required." });
    }

    const item = await AcademyImage.create({
      image,
      alt: alt || "Academy teaching photo",
    });
    res.status(201).json({ item: mapItem(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not add academy photo." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await AcademyImage.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Photo not found." });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete academy photo." });
  }
});

router.post("/reset", requireAuth, async (_req, res) => {
  try {
    await AcademyImage.deleteMany({});
    await AcademyImage.insertMany(DEFAULT_ACADEMY_GALLERY);
    const items = await AcademyImage.find().sort({ createdAt: -1 });
    res.json({ items: items.map(mapItem) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not reset academy gallery." });
  }
});

export default router;
