import { For, onMount, onCleanup } from 'solid-js';
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
let touchStartIndex = -1;
let touchStartX = 0;
let touchStartY = 0;
let touchIsDragging = false;
let touchLongPressFired = false;
let longPressTimer: ReturnType<typeof setTimeout> | null = null;

export default function PlaygroundKeyboard(props: Props) {
  let containerRef: HTMLDivElement | undefined = undefined;
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

  const toggleExclude = (e: MouseEvent | null, i: number) => {
    e?.preventDefault();
    props.setExcludedIndices(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const cancelLongPress = () => {
    if (longPressTimer !== null) { clearTimeout(longPressTimer); longPressTimer = null; }
  };

  const handleTouchStart = (e: TouchEvent, i: number) => {
    const t = e.touches[0];
    touchStartIndex = i;
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchIsDragging = false;
    touchLongPressFired = false;
    cancelLongPress();
    longPressTimer = setTimeout(() => {
      longPressTimer = null;
      touchLongPressFired = true;
      toggleExclude(null, i);
    }, 500);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStartIndex === -1) return;
    const t = e.touches[0];
    const dist = Math.hypot(t.clientX - touchStartX, t.clientY - touchStartY);
    if (!touchIsDragging && dist > 10) {
      touchIsDragging = true;
      cancelLongPress();
    }
    if (touchIsDragging) e.preventDefault();
  };

  const handleTouchEnd = (e: TouchEvent) => {
    cancelLongPress();
    if (touchIsDragging && touchStartIndex !== -1) {
      const t = e.changedTouches[0];
      const el = document.elementFromPoint(t.clientX, t.clientY);
      const keyEl = el?.closest('[data-key-index]');
      if (keyEl) {
        const endIndex = parseInt(keyEl.getAttribute('data-key-index')!, 10);
        if (!isNaN(endIndex) && endIndex !== touchStartIndex) {
          dragStartIndex = touchStartIndex;
          handleDrop(endIndex);
        }
      }
      e.preventDefault();
    } else if (touchLongPressFired) {
      e.preventDefault();
    }
    touchStartIndex = -1;
    touchIsDragging = false;
    touchLongPressFired = false;
  };

  onMount(() => {
    containerRef?.addEventListener('touchmove', handleTouchMove, { passive: false });
  });
  onCleanup(() => {
    containerRef?.removeEventListener('touchmove', handleTouchMove);
  });

  const renderKey = (i: number) => (
    <div
      draggable={true}
      data-key-index={i}
      class={key_css}
      style={getKeyStyle(i)}
      title={`Key usage: ${((props.languageData()?.characters[props.layout()[i]] ?? 0) * 100).toFixed(2)}%`}
      onDragStart={() => { dragStartIndex = i; }}
      onDrop={() => handleDrop(i)}
      onDragOver={(e: DragEvent) => e.preventDefault()}
      onDragEnd={() => { dragStartIndex = -1; }}
      onContextMenu={(e: MouseEvent) => toggleExclude(e, i)}
      onTouchStart={(e: TouchEvent) => handleTouchStart(e, i)}
      onTouchEnd={(e: TouchEvent) => handleTouchEnd(e)}
    >
      {props.layout()[i]}
    </div>
  );
    
  const onCopyLayout = () => props.onCopyLayout();

  return (
    <div
      ref={containerRef}
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
