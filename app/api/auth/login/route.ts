import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      SELECT "UserId", "Email"
      FROM "Identity"."Users"
      WHERE $1 = ANY("Email")
        AND $2 = ANY("Password")
      `,
      [email, password]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Login successful",
      user: {
        UserId: result.rows[0].UserId,
        Email: result.rows[0].Email[0], // first email
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
