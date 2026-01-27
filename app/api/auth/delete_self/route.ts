import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  const token = cookies().get("auth_token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

  await pool.query(
    `DELETE FROM "Identity"."Users" WHERE "UserId" = $1 AND "Role" != 'admin'`,
    [decoded.userId]
  );

  const res = NextResponse.json({ message: "Account deleted" });
  res.cookies.delete("auth_token");
  return res;
}
