import TRIGRAM_COMBINATIONS from "./trigram_patterns";
import type { Dof } from "./dof-utils";
import type { Key } from "libdof";
import { FINGER_LABELS, dofToLayoutString, dofToLayoutMap, dofFingerGroups } from "./dof-utils";

export interface LanguageData {
  language: string;
  convert: Record<string, string>;
  characters: Record<string, number>;
  bigrams: Record<string, number>;
  skipgrams: Record<string, number>;
  trigrams: Record<string, number>;
}

export interface TrigramFreqs {
  alternates: number;
  alternatesSfs: number;
  inrolls: number;
  outrolls: number;
  onehands: number;
  redirects: number;
  badRedirects: number;
  other: number;
  invalid: number;
}

export interface AnalysisResult {
  fingerUsage: Record<string, number>;
  centerUsage: { left: number; right: number; homerow: number };
  fingerSfb: Record<string, number>;
  dsfbTotal: number;
  lsbTotal: number;
  trigramFreqs: TrigramFreqs;
}

function getFingerUsage(finger: Set<string>, chars: Record<string, number>): number {
  let total = 0;
  finger.forEach((k) => {
    total += chars[k] ?? 0;
  });
  return total;
}

function* possibleBigrams(finger: Set<string>): Generator<string> {
  for (const a of finger) for (const b of finger) if (a !== b) yield a + b;
}

function getSfbForFinger(finger: Set<string>, bigrams: Record<string, number>): number {
  let total = 0;
  for (const bg of possibleBigrams(finger)) total += bigrams[bg] ?? 0;
  return total;
}

function getLsbs(
  layout: string,
  excludedKeys: Set<string>,
  bigrams: Record<string, number>,
): number {
  const map: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    if (!excludedKeys.has(layout[i])) map[layout[i]] = i % 10;
  }
  let res = 0;
  for (const bg in bigrams) {
    const a = map[bg[0]],
      b = map[bg[1]];
    if (
      (a === 2 && b === 4) ||
      (a === 4 && b === 2) ||
      (a === 5 && b === 7) ||
      (a === 7 && b === 5)
    ) {
      res += bigrams[bg];
    }
  }
  return res;
}

function getTrigramPattern(layoutMap: Record<string, number>, trigram: string): number {
  const a = layoutMap[trigram[0]],
    b = layoutMap[trigram[1]],
    c = layoutMap[trigram[2]];
  if (a === undefined || b === undefined || c === undefined) return -1;
  return TRIGRAM_COMBINATIONS[(a << 8) | (b << 4) | c];
}

function getTrigramStats(
  trigramData: Record<string, number>,
  layoutMap: Record<string, number>,
): TrigramFreqs {
  const f: TrigramFreqs = {
    alternates: 0,
    alternatesSfs: 0,
    inrolls: 0,
    outrolls: 0,
    onehands: 0,
    redirects: 0,
    badRedirects: 0,
    other: 0,
    invalid: 0,
  };
  for (const tg in trigramData) {
    const freq = trigramData[tg];
    switch (getTrigramPattern(layoutMap, tg)) {
      case 0:
        f.alternates += freq;
        break;
      case 1:
        f.alternatesSfs += freq;
        break;
      case 2:
        f.inrolls += freq;
        break;
      case 3:
        f.outrolls += freq;
        break;
      case 4:
        f.onehands += freq;
        break;
      case 5:
        f.redirects += freq;
        break;
      case 6:
        f.badRedirects += freq;
        break;
      case 7:
        f.other += freq;
        break;
      default:
        f.invalid += freq;
        break;
    }
  }
  return f;
}

export function analyzeLayout(
  layout: string,
  excludedKeys: Set<string>,
  ld: LanguageData,
): AnalysisResult {
  const fingers: Record<string, Set<string>> = {
    finger0: new Set([layout[0], layout[10], layout[20], "`"]),
    finger1: new Set([layout[1], layout[11], layout[21]]),
    finger2: new Set([layout[2], layout[12], layout[22]]),
    finger3: new Set([...layout.slice(3, 5), ...layout.slice(13, 15), ...layout.slice(23, 25)]),
    finger6: new Set([...layout.slice(5, 7), ...layout.slice(15, 17), ...layout.slice(25, 27)]),
    finger7: new Set([layout[7], layout[17], layout[27]]),
    finger8: new Set([layout[8], layout[18], layout[28]]),
    finger9: new Set([layout[9], layout[19], layout[29]]),
    thumbL: new Set([...layout.slice(30, 33)]),
    thumbR: new Set([...layout.slice(33, 36)]),
  };
  for (const f in fingers) excludedKeys.forEach((k) => fingers[f].delete(k));

  const fingerUsage: Record<string, number> = {};
  const fingerSfb: Record<string, number> = {};
  for (const [key, finger] of Object.entries(fingers)) {
    const shortKey = key.replace("finger", "");
    fingerUsage[shortKey] = getFingerUsage(finger, ld.characters);
    fingerSfb[shortKey] = getSfbForFinger(finger, ld.bigrams);
  }

  const centerLeft = new Set([layout[4], layout[14], layout[24]]);
  const centerRight = new Set([layout[5], layout[15], layout[25]]);
  const homerow = new Set([...layout.slice(10, 14), ...layout.slice(16, 20)]);
  const centerUsage = {
    left: getFingerUsage(centerLeft, ld.characters),
    right: getFingerUsage(centerRight, ld.characters),
    homerow: getFingerUsage(homerow, ld.characters),
  };

  let dsfbTotal = 0;
  for (const f in fingers) dsfbTotal += getSfbForFinger(fingers[f], ld.skipgrams);

  const COL_TO_FINGER = [0, 1, 2, 3, 3, 6, 6, 7, 8, 9];
  const layoutMap: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    if (!excludedKeys.has(layout[i])) layoutMap[layout[i]] = COL_TO_FINGER[i % 10];
  }
  for (let i = 30; i < 33; i++) {
    if (!excludedKeys.has(layout[i])) layoutMap[layout[i]] = 4;
    if (!excludedKeys.has(layout[i + 3])) layoutMap[layout[i + 3]] = 5;
  }

  return {
    fingerUsage,
    centerUsage,
    fingerSfb,
    dsfbTotal,
    lsbTotal: getLsbs(layout, excludedKeys, ld.bigrams),
    trigramFreqs: getTrigramStats(ld.trigrams, layoutMap),
  };
}

export function analyzeLayoutDof(
  dof: Dof,
  excludedChars: Set<string>,
  ld: LanguageData,
): AnalysisResult {
  const shape = dof.shape() as number[];
  const layer = dof.main_layer();
  const groups = dofFingerGroups(dof, excludedChars);

  const fingerUsage: Record<string, number> = {};
  const fingerSfb: Record<string, number> = {};
  for (const [fi, chars] of Object.entries(groups)) {
    const label = FINGER_LABELS[parseInt(fi)];
    fingerUsage[label] = getFingerUsage(chars, ld.characters);
    fingerSfb[label] = getSfbForFinger(chars, ld.bigrams);
  }

  const centerLeft = new Set<string>();
  const centerRight = new Set<string>();
  const homerow = new Set<string>();
  for (let r = 0; r < shape.length; r++) {
    const cols = shape[r];
    const midL = Math.floor(cols / 2) - 1;
    const midR = Math.floor(cols / 2);
    const lch = (layer.get_key(r, midL) as Key | undefined)?.char_output();
    const rch = (layer.get_key(r, midR) as Key | undefined)?.char_output();
    if (lch) centerLeft.add(lch);
    if (rch) centerRight.add(rch);
    if (r === 1) {
      for (let c = 0; c < cols; c++) {
        if (c === midL || c === midR) continue;
        const ch = (layer.get_key(1, c) as Key | undefined)?.char_output();
        if (ch && !excludedChars.has(ch)) homerow.add(ch);
      }
    }
  }

  let dsfbTotal = 0;
  for (const chars of Object.values(groups)) dsfbTotal += getSfbForFinger(chars, ld.skipgrams);

  const layoutStr = dofToLayoutString(dof);
  const layoutMap = dofToLayoutMap(dof, excludedChars);

  return {
    fingerUsage,
    centerUsage: {
      left: getFingerUsage(centerLeft, ld.characters),
      right: getFingerUsage(centerRight, ld.characters),
      homerow: getFingerUsage(homerow, ld.characters),
    },
    fingerSfb,
    dsfbTotal,
    lsbTotal: getLsbs(layoutStr, excludedChars, ld.bigrams),
    trigramFreqs: getTrigramStats(ld.trigrams, layoutMap),
  };
}

export function keyColor(prevalence: number): string {
  const color = prevalence * 30 + Math.log(prevalence * 120 + 1);
  const base = 95;
  return `rgb(${Math.round(base * 0.9 + color * 18)}, ${Math.round(base * 1.3 - color * 10)}, ${Math.round(base * 1.325 - color * 10)})`;
}

export function sfbCompareStyle(curr: number, prev: number | null): Record<string, string> {
  if (prev === null || Math.abs(curr - prev) < 0.00001) return {};
  return prev > curr
    ? { "border-color": "#080", "background-color": "#454" }
    : { "border-color": "#a00", "background-color": "#544" };
}

export function statBgColor(curr: number, prev: number | null, lowerIsBetter: boolean): string {
  if (prev === null) return "";
  let diff = (prev - curr) * 100;
  const absDiff = Math.abs(diff);
  if (lowerIsBetter) diff = -diff;
  if (absDiff < 0.001) return "";
  const intensity = Math.min(68 + absDiff * (3 / curr), 175);
  return diff < -0.001
    ? `rgb(68, ${Math.round(intensity)}, 68)`
    : `rgb(${Math.round(intensity)}, 68, 68)`;
}
