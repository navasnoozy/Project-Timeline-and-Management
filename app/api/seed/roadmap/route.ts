import { NextResponse } from "next/server";
import db from "@/lib/db";
import RoadmapItem from "@/lib/models/RoadmapItem";
import { SEED_DATA } from "./seedData";

export async function POST() {
  try {
    await db.connect();

    // Clear existing data
    await RoadmapItem.deleteMany({});

    // Simple transformation if needed, or direct insert if schema matches
    // schema expects "iconName" which is present in SEED_DATA
    // schema expects "icon" which is not required for backend (it's for frontend mapping)
    // but Mongoose schema defines iconName string.

    // We can just insert directly as SEED_DATA matches the desired structure for DB
    // (RoadmapItem backend schema)

    const seedData = SEED_DATA.map((item) => ({
      ...item,
      // Ensure deliverables have exclude flags if needed, defaulting is handled by schema though
    }));

    // Insert new data
    await RoadmapItem.insertMany(seedData);

    return NextResponse.json({
      success: true,
      message: "Roadmap data seeded successfully",
      count: seedData.length,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Seeding failed",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
