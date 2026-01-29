import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { rateLimit } from "@/lib/rateLimit";

// PATCH - Update user details (FirstName, LastName, Username)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "local";

  if (!rateLimit(`admin-update-user:${ip}`, 20, 60_000)) {
    return NextResponse.json(
      { message: "Rate limited" },
      { status: 429 }
    );
  }

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

  const { userId } = await params;
  const body = await req.json();
  const { FirstName, LastName, Username, Email } = body;

  // Build dynamic update query
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (FirstName !== undefined) {
    updates.push(`"FirstName" = $${paramIndex}`);
    values.push(FirstName);
    paramIndex++;
  }

  if (LastName !== undefined) {
    updates.push(`"LastName" = $${paramIndex}`);
    values.push(LastName);
    paramIndex++;
  }

  if (Username !== undefined) {
    updates.push(`"Username" = $${paramIndex}`);
    values.push(Username);
    paramIndex++;
  }

  if (Email !== undefined) {
    updates.push(`"Email" = $${paramIndex}`);
    values.push(Email);
    paramIndex++;
  }

  if (updates.length === 0) {
    return NextResponse.json(
      { message: "No fields to update" },
      { status: 400 }
    );
  }

  values.push(userId);

  await pool.query(
    `UPDATE "Identity"."Users"
     SET ${updates.join(", ")}
     WHERE "UserId" = $${paramIndex}`,
    values
  );

  return NextResponse.json({ message: "User updated successfully" });
}

// DELETE - Soft delete user (set IsActive to false)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "local";

  if (!rateLimit(`admin-delete-user:${ip}`, 20, 60_000)) {
    return NextResponse.json(
      { message: "Rate limited" },
      { status: 429 }
    );
  }

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

  const { userId } = await params;

  // Soft delete: set IsActive to false and set DeletedAt timestamp
  await pool.query(
    `UPDATE "Identity"."Users"
     SET "IsActive" = false, "DeletedAt" = NOW()
     WHERE "UserId" = $1`,
    [userId]
  );

  return NextResponse.json({ message: "User deactivated successfully" });
}
