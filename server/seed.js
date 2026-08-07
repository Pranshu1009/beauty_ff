import bcrypt from "bcryptjs";
import User from "./models/User.js";
import PortfolioItem from "./models/PortfolioItem.js";
import ShowItem from "./models/ShowItem.js";
import { DEFAULT_PORTFOLIO, DEFAULT_SHOWS } from "./seedData.js";

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

  const showCount = await ShowItem.countDocuments();
  if (showCount === 0) {
    await ShowItem.insertMany(DEFAULT_SHOWS);
    console.log("Seeded default TV work items");
  }
}
