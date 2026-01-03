import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { projectName, userId } = await req.json();

    if (!projectName || !userId) {
      return NextResponse.json(
        { message: "Project name and userId required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO "Project".ProjectMaster
        ("projectname", "userid", "createdby")
      VALUES
        ($1, $2, $2)
      RETURNING "projectid"
      `,
      [projectName, userId]
    );

    return NextResponse.json({
      message: "Project created successfully",
      projectId: result.rows[0].ProjectId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
