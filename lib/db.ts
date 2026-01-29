import { MongoDatabase } from "./database/MongoDatabase";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

// Global scope for caching the database connection in development
// This prevents creating multiple connections during hot reloading
const globalForDb = global as unknown as {
  mongoDatabase: MongoDatabase;
};

const db = globalForDb.mongoDatabase || new MongoDatabase(MONGODB_URI);

if (process.env.NODE_ENV !== "production") {
  globalForDb.mongoDatabase = db;
}

export default db;
