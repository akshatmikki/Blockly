import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      SELECT 
        "projectid",
        "projectname",
        "createdon"
      FROM "Project".ProjectMaster
      WHERE "userid" = $1
      ORDER BY "createdon" DESC
      `,
      [userId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
