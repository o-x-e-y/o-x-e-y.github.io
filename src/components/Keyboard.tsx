import { For } from 'solid-js';
import type { KeyData } from '../data/types';

interface Props {
  keys: KeyData[];
}

const key_css = "border border-[#555] rounded-lg text-center leading-7 select-none pb-2 pt-1";

export default function Keyboard(props: Props) {
  const rows = () => [
    props.keys.slice(0, 10),
    props.keys.slice(10, 20),
    props.keys.slice(20, 30),
  ];

  return (
    <div class="mx-auto w-full max-w-2xl bg-[#444] rounded-lg p-1.5 text-xl sm:text-2xl md:text-3xl overflow-hidden">
      <div class="grid grid-cols-11 gap-0.5">
        <For each={rows()}>
          {(row) => (
            <>
              <For each={row.slice(0, 5)}>
                {(key) => (
                  <div
                    class={key_css}
                    style={{ 'background-color': key.color }}
                    title={`Key usage: ${key.usage}`}
                  >
                    {key.letter}
                  </div>
                )}
              </For>
              <div />
              <For each={row.slice(5, 10)}>
                {(key) => (
                  <div
                    class={key_css}
                    style={{ 'background-color': key.color }}
                    title={`Key usage: ${key.usage}`}
                  >
                    {key.letter}
                  </div>
                )}
              </For>
            </>
          )}
        </For>
      </div>
    </div>
  );
}
