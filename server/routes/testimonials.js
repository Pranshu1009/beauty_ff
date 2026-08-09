import { Router } from "express";
import Testimonial from "../models/Testimonial.js";
import SectionContent from "../models/SectionContent.js";
import { requireAuth } from "../middleware/auth.js";
import { DEFAULT_TESTIMONIALS, DEFAULT_TESTIMONIAL_SECTION } from "../seedData.js";

const router = Router();

function mapItem(doc) {
  return {
    id: String(doc._id),
    name: doc.name,
    title: doc.title || "",
    quote: doc.quote,
    image: doc.image,
  };
}

async function getSection() {
  let section = await SectionContent.findOne({ key: "testimonials" });
  if (!section) {
    section = await SectionContent.create({
      key: "testimonials",
      ...DEFAULT_TESTIMONIAL_SECTION,
    });
  }
  return {
    title: section.title,
    subtitle: section.subtitle || "",
  };
}

router.get("/", async (_req, res) => {
  try {
    const [items, section] = await Promise.all([
      Testimonial.find().sort({ createdAt: -1 }),
      getSection(),
    ]);
    res.json({ items: items.map(mapItem), section });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load testimonials." });
  }
});

router.patch("/section", requireAuth, async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const subtitle = String(req.body.subtitle || "").trim();
    if (!title) {
      return res.status(400).json({ message: "Section title is required." });
    }

    const section = await SectionContent.findOneAndUpdate(
      { key: "testimonials" },
      { title, subtitle },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      section: { title: section.title, subtitle: section.subtitle || "" },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update section." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const title = String(req.body.title || "").trim();
    const quote = String(req.body.quote || "").trim();
    const image = String(req.body.image || "");

    if (!name || !quote || !image) {
      return res
        .status(400)
        .json({ message: "Name, quote, and photo are required." });
    }

    const item = await Testimonial.create({ name, title, quote, image });
    res.status(201).json({ item: mapItem(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not add testimonial." });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const item = await Testimonial.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Testimonial not found." });

    if (req.body.name != null) item.name = String(req.body.name).trim() || item.name;
    if (req.body.title != null) item.title = String(req.body.title).trim();
    if (req.body.quote != null) {
      item.quote = String(req.body.quote).trim() || item.quote;
    }
    if (req.body.image != null && req.body.image) {
      item.image = String(req.body.image);
    }

    await item.save();
    res.json({ item: mapItem(item) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update testimonial." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Testimonial not found." });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete testimonial." });
  }
});

router.post("/reset", requireAuth, async (_req, res) => {
  try {
    await Testimonial.deleteMany({});
    await Testimonial.insertMany(DEFAULT_TESTIMONIALS);
    await SectionContent.findOneAndUpdate(
      { key: "testimonials" },
      { ...DEFAULT_TESTIMONIAL_SECTION },
      { upsert: true }
    );
    const [items, section] = await Promise.all([
      Testimonial.find().sort({ createdAt: -1 }),
      getSection(),
    ]);
    res.json({ items: items.map(mapItem), section });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not reset testimonials." });
  }
});

export default router;
