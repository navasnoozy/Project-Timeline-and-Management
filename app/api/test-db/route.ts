import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    await db.connect();
    if (db.isConnected()) {
      return NextResponse.json({ message: "MongoDB Connected Successfully" });
    } else {
      return NextResponse.json({ message: "MongoDB Not Connected" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Connection Failed", error }, { status: 500 });
  }
}
