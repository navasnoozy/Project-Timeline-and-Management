import mongoose from "mongoose";
import type { IDatabase } from "../interface/IDatabase";

export class MongoDatabase implements IDatabase {
  private connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  async connect(): Promise<void> {
    try {
      if (mongoose.connection.readyState === 1) {
        return;
      }
      const conn = await mongoose.connect(this.connectionString);

      // Import model registry to ensure all schemas are registered
      // This must happen after connection is established
      await import("@/lib/models");

      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error("MongoDB connection Error", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}
