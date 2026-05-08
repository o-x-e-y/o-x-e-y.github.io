import { For } from "solid-js";
import { keyColor } from "../lib/analyzer";
import type { LanguageData } from "../lib/analyzer";
import type { Dof } from "../lib/dof-utils";
import type { Key } from "libdof";

interface Props {
  dof: Dof;
  languageData: LanguageData;
}

const key_css =
  "border border-[#555] rounded-[1.4cqw] text-center select-none pt-[2.8cqw] pb-[3.6cqw] cursor-default touch-none";

export default function Keyboard(props: Props) {
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

  const renderKey = (row: number, col: number) => (
    <div
      class={key_css}
      style={{ "background-color": getColor(row, col) }}
      title={getTitle(row, col)}
    >
      {getChar(row, col)}
    </div>
  );

  return (
    <div
      class="mx-auto w-full max-w-2xl bg-[#444] rounded-[1.5cqw] p-[0.8cqw] overflow-hidden"
      style={{ "container-type": "inline-size" }}
    >
      <div
        class="grid grid-cols-11 gap-[0.4cqw]"
        style={{ "font-size": "4.2cqw", "line-height": "0" }}
      >
        <For each={[0, 1, 2]}>
          {(row) => (
            <>
              <For each={[0, 1, 2, 3, 4]}>{(col) => renderKey(row, col)}</For>
              <div />
              <For each={[5, 6, 7, 8, 9]}>{(col) => renderKey(row, col)}</For>
            </>
          )}
        </For>
      </div>
    </div>
  );
}
