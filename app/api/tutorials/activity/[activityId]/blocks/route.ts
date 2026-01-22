import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(
  req: Request,
  context: { params: Promise<{ activityId: string }> }
) {
  try {
    // ✅ await params (THIS IS THE FIX)
    const { activityId } = await context.params

    const tutorialId = Number(activityId)

    if (Number.isNaN(tutorialId)) {
      return NextResponse.json(
        { message: "Invalid tutorial id" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `
      SELECT
        block_type,
        block_order,
        block_config
      FROM tutorials.tutorial_blocks
      WHERE tutorial_id = $1
      ORDER BY block_order
      `,
      [tutorialId]
    )

    return NextResponse.json(result.rows)
  } catch (err: any) {
    console.error("BLOCK API ERROR:", err.message)
    return NextResponse.json(
      { message: "Failed to load blocks", error: err.message },
      { status: 500 }
    )
  }
}
