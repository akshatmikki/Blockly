import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { rateLimit } from "@/lib/rateLimit";


export async function DELETE(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "local";

  // 🔒 RATE LIMIT ADMIN
  if (!rateLimit(`admin:${ip}`, 20, 60_000)) {
    return NextResponse.json(
      { message: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  requireAdmin();

  const { userId } = await req.json();

  await pool.query(
    `
    UPDATE "Identity"."Users"
    SET "DeletedAt" = NOW(), "IsActive" = FALSE
    WHERE "UserId" = $1 AND "Role" != 'admin'
    `,
    [userId]
  );

  return NextResponse.json({ message: "User soft-deleted" });
}
