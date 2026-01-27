import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

const SALT_ROUNDS = 12;

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "Email, username, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await pool.query(
      `
      SELECT 1
      FROM "Identity"."Users"
      WHERE "Email" = $1 OR "Username" = $2
      `,
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: "Email or username already in use" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const result = await pool.query(
      `
      INSERT INTO "Identity"."Users"
        ("Email", "Username", "PasswordHash")
      VALUES ($1, $2, $3)
      RETURNING "UserId", "Email", "Username", "CreatedOn"
      `,
      [email, username, passwordHash]
    );

    return NextResponse.json(
      {
        message: "Signup successful",
        user: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
