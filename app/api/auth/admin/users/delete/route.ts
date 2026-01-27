import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(req: Request) {
  requireAdmin();

  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { message: "UserId required" },
      { status: 400 }
    );
  }

  await pool.query(
    `
    UPDATE "Identity"."Users"
    SET "DeletedAt" = NOW()
    WHERE "UserId" = $1
    `,
    [userId]
  );

  return NextResponse.json({ message: "User deleted" });
}
