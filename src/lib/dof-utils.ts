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

export function dofToLayoutString(dof: Dof): string {
  return dofMainChars(dof).join("");
}

export function dofToLayoutMap(dof: Dof, excludedChars: Set<string>): Record<string, number> {
  const map: Record<string, number> = {};
  const shape = dof.shape();
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

  return map;
}

export function dofFingerGroups(dof: Dof, excludedChars: Set<string>): Record<number, Set<string>> {
  const groups: Record<number, Set<string>> = {};
  for (let i = 0; i <= 9; i++) groups[i] = new Set();

  const shape = dof.shape();
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

export function totalMainKeys(shape: number[]): number {
  return shape.reduce((s, n) => s + n, 0);
}

export function flatToRowCol(i: number, shape: number[]): [number, number] {
  let rem = i;
  for (let r = 0; r < shape.length; r++) {
    if (rem < shape[r]) return [r, rem];
    rem -= shape[r];
  }
  return [shape.length - 1, 0];
}

export function rowColToFlat(r: number, c: number, shape: number[]): number {
  let i = 0;
  for (let row = 0; row < r; row++) i += shape[row];
  return i + c;
}
