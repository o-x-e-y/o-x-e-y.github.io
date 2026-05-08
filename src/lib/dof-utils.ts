import { Dof, Finger } from "libdof";
import type { Key } from "libdof";

export { Dof } from "libdof";

export const FINGER_LABELS: Record<number, string> = {
  [Finger.LP]: "0",
  [Finger.LR]: "1",
  [Finger.LM]: "2",
  [Finger.LI]: "3",
  [Finger.LT]: "thumbL",
  [Finger.RT]: "thumbR",
  [Finger.RI]: "6",
  [Finger.RM]: "7",
  [Finger.RR]: "8",
  [Finger.RP]: "9",
};

export function dofMainChars(dof: Dof): string[] {
  return dof
    .main_layer()
    .keys()
    .map((k) => k.char_output() ?? "~");
}

export function dofToLayoutString(dof: Dof, thumbKeys: string): string {
  return dofMainChars(dof).join("") + thumbKeys;
}

export function dofToLayoutMap(
  dof: Dof,
  thumbKeys: string,
  excludedChars: Set<string>,
): Record<string, number> {
  const map: Record<string, number> = {};
  const shape = dof.shape() as number[];
  const layer = dof.main_layer();

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r]; c++) {
      const key = layer.get_key(r, c) as Key | undefined;
      const ch = key?.char_output();
      if (!ch || excludedChars.has(ch)) continue;
      const finger = dof.finger(r, c);
      if (finger !== undefined) map[ch] = finger as unknown as number;
    }
  }

  for (let i = 0; i < 3; i++) {
    const lch = thumbKeys[i];
    const rch = thumbKeys[i + 3];
    if (lch && !excludedChars.has(lch)) map[lch] = Finger.LT;
    if (rch && !excludedChars.has(rch)) map[rch] = Finger.RT;
  }

  return map;
}

export function dofFingerGroups(
  dof: Dof,
  thumbKeys: string,
  excludedChars: Set<string>,
): Record<number, Set<string>> {
  const groups: Record<number, Set<string>> = {};
  for (let i = 0; i <= 9; i++) groups[i] = new Set();

  const shape = dof.shape() as number[];
  const layer = dof.main_layer();

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r]; c++) {
      const key = layer.get_key(r, c) as Key | undefined;
      const ch = key?.char_output();
      if (!ch || excludedChars.has(ch)) continue;
      const finger = dof.finger(r, c);
      if (finger !== undefined) groups[finger as unknown as number]?.add(ch);
    }
  }

  // Backtick is conventionally included with LP (left pinky), matching original analyzer behavior
  groups[Finger.LP].add("`");

  for (let i = 0; i < 3; i++) {
    const lch = thumbKeys[i];
    const rch = thumbKeys[i + 3];
    if (lch && !excludedChars.has(lch)) groups[Finger.LT].add(lch);
    if (rch && !excludedChars.has(rch)) groups[Finger.RT].add(rch);
  }

  return groups;
}

export function swapAndRebuild(dof: Dof, r1: number, c1: number, r2: number, c2: number): Dof {
  dof.swap("main", r1, c1, "main", r2, c2);
  return new Dof(dof.serialize());
}

export async function loadDof(name: string): Promise<Dof> {
  const res = await fetch(`/stored_layouts/${name}.dof`);
  if (!res.ok) throw new Error(`Failed to load layout: ${name}`);
  const text = await res.text();
  return new Dof(text);
}
