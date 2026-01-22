import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(req: Request) {
  try {
    // 🔑 Extract type from URL
    const url = new URL(req.url)
    const segments = url.pathname.split("/")
    const type = segments[segments.length - 2].toUpperCase()

    const result = await pool.query(
      `
      SELECT
        ta.id,
        ta.activity_name,
        ta.level,
        ta.pdf_url,
        ta.video_url,
        ta.activity_order
      FROM tutorials.tutorial_activity ta
      JOIN tutorials.tutorial_master tm
        ON tm.id = ta.tutorial_id
      WHERE tm.type = $1::tutorials.tutorial_type
      ORDER BY ta.activity_order
      `,
      [type]
    )

    return NextResponse.json(result.rows)
  } catch (err: any) {
    console.error("API ERROR:", err.message)
    return NextResponse.json(
      { message: "Failed to load activities", error: err.message },
      { status: 500 }
    )
  }
}
