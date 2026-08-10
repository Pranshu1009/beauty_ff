import { Router } from "express";
import SectionContent from "../models/SectionContent.js";
import { requireAuth } from "../middleware/auth.js";
import { DEFAULT_ANNOUNCEMENT } from "../seedData.js";

const router = Router();

async function getAnnouncement() {
  let doc = await SectionContent.findOne({ key: "announcement" });
  if (!doc) {
    doc = await SectionContent.create({
      key: "announcement",
      ...DEFAULT_ANNOUNCEMENT,
    });
  }
  return { text: doc.title || DEFAULT_ANNOUNCEMENT.title };
}

router.get("/", async (_req, res) => {
  try {
    const announcement = await getAnnouncement();
    res.json({ announcement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load announcement." });
  }
});

router.patch("/", requireAuth, async (req, res) => {
  try {
    const text = String(req.body.text || "").trim();
    if (!text) {
      return res.status(400).json({ message: "Announcement text is required." });
    }

    const doc = await SectionContent.findOneAndUpdate(
      { key: "announcement" },
      { title: text, subtitle: "" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ announcement: { text: doc.title } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update announcement." });
  }
});

export default router;
