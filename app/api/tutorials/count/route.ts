import { NextResponse } from "next/server"
import pool from "@/lib/db" // your pg pool

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
  type,
  COUNT(*) AS tutorial_count
FROM tutorials.tutorial_master
GROUP BY type
ORDER BY type;
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to fetch tutorial counts" },
      { status: 500 }
    )
  }
}
