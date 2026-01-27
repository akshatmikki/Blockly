import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  requireAdmin();

  const result = await pool.query(
    `
    SELECT
      "UserId",
      "Email",
      "Username",
      "Role",
      "IsActive",
      "DeletedAt"
    FROM "Identity"."Users"
    WHERE "DeletedAt" IS NULL
    ORDER BY "CreatedOn" DESC
    `
  );

  return NextResponse.json({ users: result.rows });
}
    