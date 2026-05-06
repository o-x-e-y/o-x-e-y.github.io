import { For } from 'solid-js';
import type { KeyData } from '../data/types';

interface Props {
  keys: KeyData[];
}

const key_css = "border border-[#555] rounded-[1.4cqw] text-center select-none pt-[2.8cqw] pb-[3.6cqw] cursor-default touch-none";

export default function Keyboard(props: Props) {
  const rows = () => [
    props.keys.slice(0, 10),
    props.keys.slice(10, 20),
    props.keys.slice(20, 30),
  ];

  return (
    <div class="mx-auto w-full max-w-2xl bg-[#444] rounded-[1.5cqw] p-[0.8cqw] overflow-hidden" style={{ 'container-type': 'inline-size' }}>
      <div class="grid grid-cols-11 gap-[0.4cqw]" style={{ 'font-size': '4.2cqw', 'line-height': '0' }}>
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
