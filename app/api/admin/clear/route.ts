import { NextResponse } from "next/server";
import { readState, writeState } from "@/lib/state";

export async function POST() {
  const state = await readState();

  state.queue = [];

  await writeState(state);

  return NextResponse.json({ ok: true });
}