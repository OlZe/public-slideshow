import { NextResponse } from "next/server";
import { readState, writeState } from "@/lib/state";

export async function POST(req: Request) {
  const { filename } = await req.json();

  const state = await readState();

  state.queue = state.queue.filter((f) => f !== filename);

  await writeState(state);

  return NextResponse.json({ ok: true });
}