import { For, onCleanup } from 'solid-js';
import type { Accessor, Setter } from 'solid-js';
import {
  DragDropProvider,
  DragDropSensors,
  createDraggable,
  createDroppable,
} from '@thisbeyond/solid-dnd';
import { keyColor } from '../../lib/analyzer';
import type { LanguageData } from '../../lib/analyzer';

// Teach TypeScript about use:draggable / use:droppable directives
/* eslint-disable no-unused-vars */
declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      draggable: ReturnType<typeof createDraggable>;
      droppable: ReturnType<typeof createDroppable>;
    }
  }
}
/* eslint-enable no-unused-vars */

interface Props {
  layout: Accessor<string>;
  setLayout: Setter<string>;
  excludedIndices: Accessor<Set<number>>;
  setExcludedIndices: Setter<Set<number>>;
  languageData: Accessor<LanguageData | null>;
  onCopyLayout: () => void;
}

const key_css = "border border-[#555] rounded-[1.4cqw] text-center select-none pt-[2.8cqw] pb-[3.6cqw] cursor-default touch-none";

interface KeyTileProps {
  index: number;
  char: Accessor<string>;
  style: Accessor<{ 'background-color': string; opacity: string }>;
  title: Accessor<string>;
  onToggleExclude: (_i: number) => void;
}

const KeyTile = (props: KeyTileProps) => {
  // eslint-disable-next-line no-unused-vars
  const draggable = createDraggable(props.index);
  // eslint-disable-next-line no-unused-vars
  const droppable = createDroppable(props.index);

  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let longPressFired = false;

  const cancelLongPress = () => {
    if (longPressTimer !== null) { clearTimeout(longPressTimer); longPressTimer = null; }
  };

  const handleTouchStart = () => {
    longPressFired = false;
    cancelLongPress();
    longPressTimer = setTimeout(() => {
      longPressTimer = null;
      longPressFired = true;
      props.onToggleExclude(props.index);
    }, 500);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    cancelLongPress();
    if (longPressFired) { e.preventDefault(); longPressFired = false; }
  };

  onCleanup(cancelLongPress);

  return (
    <div
      use:draggable
      use:droppable
      class={key_css}
      style={props.style()}
      title={props.title()}
      onContextMenu={(e: MouseEvent) => { e.preventDefault(); props.onToggleExclude(props.index); }}
      onTouchStart={handleTouchStart}
      onTouchMove={cancelLongPress}
      onTouchEnd={handleTouchEnd}
    >
      {props.char()}
    </div>
  );
};

export default function PlaygroundKeyboard(props: Props) {
  const getKeyStyle = (i: number) => {
    const opacity = props.excludedIndices().has(i) ? '0.33' : '1.0';
    const ld = props.languageData();
    if (!ld) return { 'background-color': 'rgb(86, 124, 126)', opacity };
    const prevalence = ld.characters[props.layout()[i]] ?? 0;
    return { 'background-color': keyColor(prevalence), opacity };
  };

  const toggleExclude = (i: number) => {
    props.setExcludedIndices(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const handleDragEnd = ({ draggable, droppable }: { draggable: { id: number }, droppable: { id: number } | null }) => {
    if (!droppable || draggable.id === droppable.id) return;
    const si = draggable.id;
    const ei = droppable.id;
    props.setLayout(prev => {
      const arr = [...prev];
      [arr[si], arr[ei]] = [arr[ei], arr[si]];
      return arr.join('');
    });
    props.setExcludedIndices(prev => {
      const startEx = prev.has(si);
      const endEx = prev.has(ei);
      if (startEx === endEx) return prev;
      const next = new Set(prev);
      if (startEx) { next.delete(si); next.add(ei); }
      else { next.delete(ei); next.add(si); }
      return next;
    });
  };

  const renderKey = (i: number) => (
    <KeyTile
      index={i}
      char={() => props.layout()[i]}
      style={() => getKeyStyle(i)}
      title={() => `Key usage: ${((props.languageData()?.characters[props.layout()[i]] ?? 0) * 100).toFixed(2)}%`}
      onToggleExclude={toggleExclude}
    />
  );

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <DragDropSensors>
        <div
          class="mx-auto w-full max-w-2xl bg-[#444] rounded-[1.5cqw] p-[0.8cqw] overflow-hidden cursor-pointer"
          style={{ 'container-type': 'inline-size' }}
          onClick={props.onCopyLayout}
        >
          <div class="grid grid-cols-11 gap-[0.4cqw]" style={{ 'font-size': '4.2cqw', 'line-height': '0' }}>
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
      </DragDropSensors>
    </DragDropProvider>
  );
}
