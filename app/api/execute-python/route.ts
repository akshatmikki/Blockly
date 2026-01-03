// app/api/execute-python/route.ts
import { NextResponse } from "next/server"
import { spawn } from "child_process"

export const runtime = "nodejs" // 🔴 REQUIRED

export async function POST(req: Request) {
  const { code } = await req.json()

  return new Promise((resolve) => {
    const python = spawn("python", ["-u", "-"])

    let stdout = ""
    let stderr = ""

    python.stdout.on("data", (d) => (stdout += d.toString()))
    python.stderr.on("data", (d) => (stderr += d.toString()))

    python.on("close", () => {
      if (stderr.trim()) {
        resolve(NextResponse.json({ error: stderr }))
      } else {
        resolve(NextResponse.json({ output: stdout }))
      }
    })

    python.stdin.write(code)
    python.stdin.end()
  })
}
