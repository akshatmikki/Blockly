import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    await requireAdmin();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }

  const result = await pool.query(`
    SELECT
      "UserId",
      "Email",
      "Username",
      "Role",
      "IsActive",
      "CreatedOn"
    FROM "Identity"."Users"
    WHERE "DeletedAt" IS NULL
    ORDER BY "CreatedOn" DESC
  `);

  return NextResponse.json(result.rows);
}
