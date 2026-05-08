import { readdirSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";

const STORED_DIR = join(import.meta.dir, "..", "public", "stored_layouts");

const files = readdirSync(STORED_DIR).filter((f) => f.endsWith(".json"));
let converted = 0;

for (const file of files) {
  const path = join(STORED_DIR, file);
  const src = JSON.parse(readFileSync(path, "utf8"));

  // layers.main is currently a newline-joined string — split into row array
  const mainStr: string = src.layers.main;
  const rows = mainStr.split("\n");

  const dof = { ...src, layers: { main: rows }, fingering: "traditional" };

  const outPath = join(STORED_DIR, file.replace(/\.json$/, ".dof"));
  writeFileSync(outPath, JSON.stringify(dof, null, "\t"));
  unlinkSync(path);
  converted++;
}

console.log(`Done: ${converted} files converted to .dof`);
