import { storage } from "../storage";

// This file is used to seed the database with initial data
async function seedDatabase() {
  try {
    await storage.seedDatabase();
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
