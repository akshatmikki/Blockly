import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { rateLimit } from "../../../../lib/rateLimit";

export async function POST(req: Request) {
  // ⬇️⬇️⬇️ RATE LIMIT GOES HERE ⬇️⬇️⬇️
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "local";

  if (!rateLimit(`login:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { message: "Too many login attempts" },
      { status: 429 }
    );
  }
  // ⬆️⬆️⬆️ NOTHING GOES ABOVE THIS ⬆️⬆️⬆️

  // NOW you parse the request body
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password required" },
      { status: 400 }
    );
  }

  // NOW you talk to the database
  const result = await pool.query(
    `
    SELECT
      "UserId",
      "Email",
      "PasswordHash",
      "Role",
      "IsActive"
    FROM "Identity"."Users"
    WHERE "Email" = $1
      AND "DeletedAt" IS NULL
    `,
    [email]
  );

  if (result.rowCount === 0) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const user = result.rows[0];

  if (!user.IsActive) {
    return NextResponse.json(
      { message: "Account disabled" },
      { status: 403 }
    );
  }

  const ok = await bcrypt.compare(password, user.PasswordHash);
  if (!ok) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  console.log("Login: User found:", { userId: user.UserId, email: user.Email, role: user.Role });

  const token = jwt.sign(
    { userId: user.UserId, role: user.Role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  console.log("Login: JWT token created with payload:", { userId: user.UserId, role: user.Role });

  const res = NextResponse.json({
    message: "Login successful",
    user: {
      UserId: user.UserId,
      Email: user.Email,
      Role: user.Role,
    },
  });

  res.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  console.log("Login: Cookie set, returning response");

  return res;
}
