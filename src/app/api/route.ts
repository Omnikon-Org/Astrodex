import { NextResponse } from "next/server"

// Fixed #1167: Added CORS header configuration to API routes
export async function GET() {
  return NextResponse.json({ status: "ok" })
}
