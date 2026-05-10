import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const LAYOUTS_DIR = join(import.meta.dir, "..", "public", "stored_layouts");
const THUMB_ROW = "    = / ␣ ⇑ ↻ -    ";

const files = readdirSync(LAYOUTS_DIR).filter((f) => f.endsWith(".dof"));
let converted = 0;
let skipped = 0;

for (const file of files) {
  const path = join(LAYOUTS_DIR, file);
  const text = readFileSync(path, "utf-8");

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error(`  parse error: ${file}: ${e}`);
    skipped++;
    continue;
  }

  const layers = data.layers as Record<string, string[]> | undefined;
  if (!layers?.main) {
    console.log(`  skip (no main layer): ${file}`);
    skipped++;
    continue;
  }

  if (layers.main.length !== 3) {
    console.log(`  skip (${layers.main.length} rows): ${file}`);
    skipped++;
    continue;
  }

  layers.main.push(THUMB_ROW);

  writeFileSync(path, JSON.stringify(data, null, "\t") + "\n", "utf-8");
  console.log(`  converted: ${file}`);
  converted++;
}

console.log(`\n${converted} converted, ${skipped} skipped`);
