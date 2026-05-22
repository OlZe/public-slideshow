import { NextResponse } from "next/server";
import { readState, writeState } from "@/lib/state";
import { readdir } from "fs/promises";
import path from "path";

export async function GET() {
  const state = await readState();

  // 1. PRIORITY: queue
  if (state.queue.length > 0) {
    const next = state.queue.shift()!;
    await writeState(state);

    return NextResponse.json({ photo: `/api/photo/${next}` });
  }

  // 2. fallback: random from all files
  const photosDir = path.join(process.cwd(), "uploads");
  const files = await readdir(photosDir);
  const images = files.map((f) => `/api/photo/${f}`);

  // shuffle once per request
  const shuffled = shuffle([...images]);

  const random = shuffled[0];

  return NextResponse.json({ photo: random });
}

function shuffle(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}