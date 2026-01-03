import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(req: Request) {
  const { projectId } = await req.json();

  await pool.query(
    `DELETE FROM "Project".ProjectMaster WHERE "projectid" = $1`,
    [projectId]
  );

  return NextResponse.json({ success: true });
}
