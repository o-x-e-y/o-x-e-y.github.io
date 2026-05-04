import { For } from 'solid-js';
import type { Accessor, Setter } from 'solid-js';
import { keyColor } from '../../lib/analyzer';
import type { LanguageData } from '../../lib/analyzer';

interface Props {
  layout: Accessor<string>;
  setLayout: Setter<string>;
  excludedIndices: Accessor<Set<number>>;
  setExcludedIndices: Setter<Set<number>>;
  languageData: Accessor<LanguageData | null>;
  onCopyLayout: () => void;
}

const key_css = "border border-[#555] rounded-lg text-center leading-7 select-none pb-2 pt-1 cursor-default";

let dragStartIndex = -1;

export default function PlaygroundKeyboard(props: Props) {
  const getKeyStyle = (i: number) => {
    let opacity = '1.0';
    if (props.excludedIndices().has(i)) {
      opacity = '0.33';
    }
    const ld = props.languageData();
    if (!ld) return { 'background-color': 'rgb(86, 124, 126)', opacity };
    const char = props.layout()[i];
    const prevalence = ld.characters[char] ?? 0;
    return { 'background-color': keyColor(prevalence), opacity };
  };

  const handleDrop = (endIndex: number) => {
    if (dragStartIndex === -1 || dragStartIndex === endIndex) return;
    const si = dragStartIndex;
    props.setLayout(prev => {
      const arr = [...prev];
      [arr[si], arr[endIndex]] = [arr[endIndex], arr[si]];
      return arr.join('');
    });
    props.setExcludedIndices(prev => {
      const startEx = prev.has(si);
      const endEx = prev.has(endIndex);
      if (startEx === endEx) return prev;
      const next = new Set(prev);
      if (startEx) { next.delete(si); next.add(endIndex); }
      else { next.delete(endIndex); next.add(si); }
      return next;
    });
    dragStartIndex = -1;
  };

  const toggleExclude = (e: MouseEvent, i: number) => {
    e.preventDefault();
    props.setExcludedIndices(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const renderKey = (i: number) => (
    <div
      draggable={true}
      class={key_css}
      style={getKeyStyle(i)}
      title={`Key usage: ${((props.languageData()?.characters[props.layout()[i]] ?? 0) * 100).toFixed(2)}%`}
      onDragStart={() => { dragStartIndex = i; }}
      onDrop={() => handleDrop(i)}
      onDragOver={(e: DragEvent) => e.preventDefault()}
      onDragEnd={() => { dragStartIndex = -1; }}
      onContextMenu={(e: MouseEvent) => toggleExclude(e, i)}
    >
      {props.layout()[i]}
    </div>
  );
    
  const onCopyLayout = () => props.onCopyLayout();

  return (
    <div
      class="mx-auto w-full max-w-2xl bg-[#444] rounded-lg p-1.5 text-xl sm:text-2xl md:text-3xl overflow-hidden cursor-pointer"
      onClick={onCopyLayout}
    >
      <div class="grid grid-cols-11 gap-0.5">
        <For each={[0, 1, 2]}>
          {(row) => (
            <>
              <For each={[0, 1, 2, 3, 4]}>
                {(col) => renderKey(row * 10 + col)}
              </For>
              <div />
              <For each={[5, 6, 7, 8, 9]}>
                {(col) => renderKey(row * 10 + col)}
              </For>
            </>
          )}
        </For>
        {/* Thumb row */}
        <div /><div />
        {renderKey(30)}{renderKey(31)}{renderKey(32)}
        <div />
        {renderKey(33)}{renderKey(34)}{renderKey(35)}
        <div /><div />
      </div>
    </div>
  );
}
