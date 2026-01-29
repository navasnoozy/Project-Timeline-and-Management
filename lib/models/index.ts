/**
 * Centralized Model Registry
 *
 * This file imports and exports all Mongoose models to ensure they are
 * registered with Mongoose before any populate() calls are made.
 *
 * IMPORTANT: Import this file (or import from it) in any route that uses
 * Mongoose models to ensure all referenced schemas are available.
 *
 * Best Practice: This file is automatically imported by the database
 * connection module to guarantee all models are registered on startup.
 */

// User model - required by Session for populate()
export { User } from "./User";
export type { UserDoc, UserAttrs, Provider } from "./User";

// Session model - references User
export { Session } from "./Session";
export type { ISession } from "./Session";

// Roadmap models
export { default as RoadmapItem } from "./RoadmapItem";

// Roadmap Header model
export { RoadmapHeader } from "./RoadmapHeader";
