import { For, createMemo } from "solid-js";
import { keyColor } from "../lib/analyzer";
import type { LanguageData } from "../lib/analyzer";
import type { Dof } from "../lib/dof-utils";
import type { Key, PhysicalKey } from "libdof";

interface Props {
  dof: Dof;
  languageData: LanguageData;
}

const GAP = 0.2;

const key_css =
  "absolute border border-[#555] rounded-[12%] flex items-center justify-center select-none cursor-default touch-none";

export default function Keyboard(props: Props) {
  const boardGeom = createMemo(() => {
    const rawBoard = props.dof.board() as PhysicalKey[][];
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    const board = rawBoard.map((row) =>
      row.map((pk) => ({ x: pk.x, y: pk.y, width: pk.width, height: pk.height })),
    );
    for (const row of board)
      for (const k of row) {
        minX = Math.min(minX, k.x);
        minY = Math.min(minY, k.y);
        maxX = Math.max(maxX, k.x + k.width);
        maxY = Math.max(maxY, k.y + k.height);
      }
    const dx = maxX - minX;
    const dy = maxY - minY;
    const kw = 100 / dx;
    const ym = dx / dy;
    const heightCss = dy * kw;
    const fontSizeCqw = kw / 2.25;
    return { kw, ym, heightCss, fontSizeCqw, minX, minY, board };
  });

  const getChar = (row: number, col: number): string =>
    (props.dof.main_layer().get_key(row, col) as Key | undefined)?.char_output() ?? "~";

  const getColor = (row: number, col: number): string => {
    const ch = getChar(row, col);
    return keyColor(props.languageData.characters[ch] ?? 0);
  };

  const getTitle = (row: number, col: number): string => {
    const ch = getChar(row, col);
    return `Key usage: ${((props.languageData.characters[ch] ?? 0) * 100).toFixed(2)}%`;
  };

  return (
    <div
      class="mx-auto w-full max-w-lg bg-[#444] rounded-[1.5cqw] p-[0.8cqw] overflow-hidden"
      style={{ "container-type": "inline-size" }}
    >
      <div
        class="relative w-full"
        style={{
          "aspect-ratio": `100 / ${boardGeom().heightCss}`,
          "font-size": `${boardGeom().fontSizeCqw.toFixed(2)}cqw`,
          "line-height": "0",
        }}
      >
        <For each={boardGeom().board}>
          {(row, ri) => (
            <For each={row}>
              {(pk, ci) => {
                const { kw, ym, minX, minY } = boardGeom();
                return (
                  <div
                    class={key_css}
                    style={{
                      left: `${(pk.x - minX) * kw + GAP}%`,
                      top: `${(pk.y - minY) * kw * ym + GAP * ym}%`,
                      width: `${pk.width * kw - GAP * 2}%`,
                      height: `${(pk.height * kw - GAP * 2) * ym}%`,
                      "background-color": getColor(ri(), ci()),
                    }}
                    title={getTitle(ri(), ci())}
                  >
                    {getChar(ri(), ci())}
                  </div>
                );
              }}
            </For>
          )}
        </For>
      </div>
    </div>
  );
}
