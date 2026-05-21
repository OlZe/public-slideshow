import { readdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  const photosDir = path.join(process.cwd(), "public/photos");

  const files = await readdir(photosDir);

  const photos = files.map((file) => `/photos/${file}`);

  return NextResponse.json(photos);
}