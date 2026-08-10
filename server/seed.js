import bcrypt from "bcryptjs";
import User from "./models/User.js";
import PortfolioItem from "./models/PortfolioItem.js";
import ShowItem from "./models/ShowItem.js";
import Testimonial from "./models/Testimonial.js";
import SectionContent from "./models/SectionContent.js";
import {
  DEFAULT_PORTFOLIO,
  DEFAULT_SHOWS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_TESTIMONIAL_SECTION,
  DEFAULT_ANNOUNCEMENT,
} from "./seedData.js";

export async function seedDefaults() {
  const username = process.env.OWNER_USERNAME || "roshani";
  const password = process.env.OWNER_PASSWORD || "Roshani@2026";

  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash });
    console.log(`Seeded owner user: ${username}`);
  }

  const count = await PortfolioItem.countDocuments();
  if (count === 0) {
    await PortfolioItem.insertMany(DEFAULT_PORTFOLIO);
    console.log("Seeded default portfolio items");
  }

  // Remove leftover Celebrity entries from the old dual-section model
  const removed = await ShowItem.deleteMany({ section: "Celebrity" });
  if (removed.deletedCount) {
    console.log(`Removed ${removed.deletedCount} legacy celebrity show items`);
  }
  await ShowItem.updateMany({}, { $unset: { section: 1 } });

  // Migrate legacy single `image` field → `images` array
  const legacyDocs = await ShowItem.collection
    .find({
      $and: [
        {
          $or: [
            { images: { $exists: false } },
            { images: null },
            { images: { $size: 0 } },
          ],
        },
        { image: { $type: "string" } },
      ],
    })
    .toArray();

  for (const doc of legacyDocs) {
    await ShowItem.collection.updateOne(
      { _id: doc._id },
      { $set: { images: [doc.image] }, $unset: { image: "" } }
    );
  }
  if (legacyDocs.length) {
    console.log(`Migrated ${legacyDocs.length} TV shows to multi-image format`);
  }

  const showCount = await ShowItem.countDocuments();
  if (showCount === 0) {
    await ShowItem.insertMany(DEFAULT_SHOWS);
    console.log("Seeded default TV work items");
  }

  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany(DEFAULT_TESTIMONIALS);
    console.log("Seeded default testimonials");
  }

  const section = await SectionContent.findOne({ key: "testimonials" });
  if (!section) {
    await SectionContent.create({
      key: "testimonials",
      ...DEFAULT_TESTIMONIAL_SECTION,
    });
    console.log("Seeded testimonials section content");
  }

  const announcement = await SectionContent.findOne({ key: "announcement" });
  if (!announcement) {
    await SectionContent.create({
      key: "announcement",
      ...DEFAULT_ANNOUNCEMENT,
    });
    console.log("Seeded announcement banner text");
  }
}
