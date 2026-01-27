import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });

  res.cookies.set("auth_token", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    path: "/",
    maxAge: 0,
  });

  return res;
}
