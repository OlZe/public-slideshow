import { readFile, writeFile } from "fs/promises";
import path from "path";

const STATE_PATH = path.join(process.cwd(), "data/state.json");

export type State = {
  queue: string[];
};

export async function readState(): Promise<State> {
  try {
    const raw = await readFile(STATE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { queue: [] };
  }
}

export async function writeState(state: State) {
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2));
}