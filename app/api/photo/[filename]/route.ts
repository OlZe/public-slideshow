import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    const filePath = path.join(
      process.cwd(),
      "uploads",
      filename
    );

    const file = await readFile(filePath);

    const ext = filename.split(".").pop();

    const contentType =
      ext === "png"
        ? "image/png"
        : ext === "webp"
        ? "image/webp"
        : "image/jpeg";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}