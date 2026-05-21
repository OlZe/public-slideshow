import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { NextResponse } from "next/server";
import { readState, writeState } from "@/lib/state";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = file.name.split(".").pop();

    const filename = `${uuid()}.${extension}`;

    const filepath = path.join(
      process.cwd(),
      "public/photos",
      filename
    );

    await writeFile(filepath, buffer);

    await writeFile(filepath, buffer);

    // add to queue
    const state = await readState();

    state.queue.push(`/photos/${filename}`);

    await writeState(state);

    return NextResponse.json({
      success: true,
      filename,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}