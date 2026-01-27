import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query(
    `SELECT 1 FROM "Identity"."Users" WHERE "Role" = 'admin' LIMIT 1`
  );

  return NextResponse.json({
    exists: result.rowCount > 0,
  });
}
