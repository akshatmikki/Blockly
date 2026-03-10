import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";

export const runtime = "nodejs";

type CompileRequest = {
  mainTs?: string;
  projectName?: string;
};

type CmdResult = {
  code: number;
  stdout: string;
  stderr: string;
};

function sanitizeName(name: string) {
  return (name || "microbit-project").replace(/[^a-z0-9-_]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function runCommand(command: string, args: string[], cwd: string): Promise<CmdResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, shell: false });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => {
      stdout += d.toString();
    });

    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    child.on("close", (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });

    child.on("error", (err) => {
      resolve({ code: 1, stdout, stderr: `${stderr}\n${String(err)}` });
    });
  });
}

async function findArtifactFile(root: string): Promise<string | null> {
  const queue: string[] = [root];
  const candidates: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;

    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(full);
      } else if (entry.isFile()) {
        if (entry.name.toLowerCase().endsWith(".hex") || entry.name.toLowerCase().endsWith(".uf2")) {
          candidates.push(full);
        }
      }
    }
  }

  if (candidates.length === 0) return null;
  const hex = candidates.find((f) => f.toLowerCase().endsWith(".hex"));
  return hex || candidates[0];
}

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as CompileRequest;
  const mainTs = (body.mainTs || "").trim();
  const projectName = sanitizeName(body.projectName || "microbit-project");

  if (!mainTs) {
    return NextResponse.json({ message: "mainTs is required" }, { status: 400 });
  }

  const tempDir = path.join(os.tmpdir(), `mkc-${projectName}-${crypto.randomUUID()}`);

  try {
    await fs.mkdir(tempDir, { recursive: true });

    const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
    const init = await runCommand(npxCmd, ["-y", "makecode", "init", "microbit"], tempDir);
    if (init.code !== 0) {
      return NextResponse.json(
        {
          message: "Failed to initialize MakeCode micro:bit project.",
          stderr: init.stderr,
          stdout: init.stdout
        },
        { status: 500 }
      );
    }

    await fs.writeFile(path.join(tempDir, "main.ts"), mainTs, "utf8");

    const build = await runCommand(
      npxCmd,
      ["-y", "makecode", "build", "--always-built"],
      tempDir,
    );

    if (build.code !== 0) {
      return NextResponse.json(
        {
          message: "Compile failed. Ensure makecode CLI can download dependencies and target files.",
          stderr: build.stderr,
          stdout: build.stdout
        },
        { status: 500 }
      );
    }

    const artifact = await findArtifactFile(path.join(tempDir, "built"));
    if (!artifact) {
      return NextResponse.json(
        { message: "Build completed but no .hex/.uf2 artifact found.", stdout: build.stdout },
        { status: 500 }
      );
    }

    const content = await fs.readFile(artifact);
    const base64 = content.toString("base64");

    return NextResponse.json({
      fileName: path.basename(artifact),
      base64,
      stdout: build.stdout
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown compile error";
    return NextResponse.json({ message }, { status: 500 });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
  }
}
