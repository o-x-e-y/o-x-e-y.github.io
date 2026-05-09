import { For, Show, createMemo, onCleanup } from "solid-js";
import type { Accessor, Setter } from "solid-js";
import {
  DragDropProvider,
  DragDropSensors,
  createDraggable,
  createDroppable,
} from "@thisbeyond/solid-dnd";
import { keyColor } from "../../lib/analyzer";
import type { LanguageData } from "../../lib/analyzer";
import {
  Dof,
  swapAndRebuild,
  flatToRowCol,
  rowColToFlat,
  totalMainKeys,
} from "../../lib/dof-utils";
import type { Key, PhysicalKey } from "libdof";

// Teach TypeScript about use:draggable / use:droppable directives
/* eslint-disable no-unused-vars */
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      draggable: ReturnType<typeof createDraggable>;
      droppable: ReturnType<typeof createDroppable>;
    }
  }
}
/* eslint-enable no-unused-vars */

interface Props {
  dof: Accessor<Dof | null>;
  setDof: Setter<Dof | null>;
  excludedIndices: Accessor<Set<number>>;
  setExcludedIndices: Setter<Set<number>>;
  languageData: Accessor<LanguageData | null>;
  onCopyLayout: () => void;
}

const GAP = 0.2;

const key_css =
  "w-full h-full border border-[#555] rounded-[12%] flex items-center justify-center select-none cursor-default touch-none";

interface KeyTileProps {
  index: number;
  char: Accessor<string>;
  style: Accessor<{ "background-color": string; opacity: string }>;
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
    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
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
    if (longPressFired) {
      e.preventDefault();
      longPressFired = false;
    }
  };

  onCleanup(cancelLongPress);

  return (
    <div
      use:draggable
      use:droppable
      class={key_css}
      style={props.style()}
      title={props.title()}
      onContextMenu={(e: MouseEvent) => {
        e.preventDefault();
        cancelLongPress();
        if (!longPressFired) props.onToggleExclude(props.index);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={cancelLongPress}
      onTouchEnd={handleTouchEnd}
    >
      {props.char()}
    </div>
  );
};

export default function PlaygroundKeyboard(props: Props) {
  const boardGeom = createMemo(() => {
    const dof = props.dof();
    if (!dof) return null;
    const rawBoard = dof.board() as PhysicalKey[][];
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

  const getKeyChar = (i: number): string => {
    const dof = props.dof();
    if (!dof) return "?";
    const shape = Array.from(dof.shape());
    const [row, col] = flatToRowCol(i, shape);
    return (dof.main_layer().get_key(row, col) as Key | undefined)?.char_output() ?? "~";
  };

  const getKeyStyle = (i: number) => {
    const opacity = props.excludedIndices().has(i) ? "0.33" : "1.0";
    const ld = props.languageData();
    if (!ld) return { "background-color": "rgb(86, 124, 126)", opacity };
    const prevalence = ld.characters[getKeyChar(i)] ?? 0;
    return { "background-color": keyColor(prevalence), opacity };
  };

  const getKeyTitle = (i: number): string => {
    const ch = getKeyChar(i);
    return `Key usage: ${((props.languageData()?.characters[ch] ?? 0) * 100).toFixed(2)}%`;
  };

  const toggleExclude = (i: number) => {
    props.setExcludedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const handleDragEnd = ({
    draggable,
    droppable,
  }: {
    draggable: { id: number };
    droppable: { id: number } | null;
  }) => {
    if (!droppable || draggable.id === droppable.id) return;
    const si = draggable.id;
    const ei = droppable.id;
    const dof = props.dof();
    if (!dof) return;
    const shape = Array.from(dof.shape());
    const [sr, sc] = flatToRowCol(si, shape);
    const [er, ec] = flatToRowCol(ei, shape);
    props.setDof((prev) => (prev ? swapAndRebuild(prev, sr, sc, er, ec) : prev));

    props.setExcludedIndices((prev) => {
      const startEx = prev.has(si);
      const endEx = prev.has(ei);
      if (startEx === endEx) return prev;
      const next = new Set(prev);
      if (startEx) {
        next.delete(si);
        next.add(ei);
      } else {
        next.delete(ei);
        next.add(si);
      }
      return next;
    });
  };

  const renderKey = (i: number) => (
    <KeyTile
      index={i}
      char={() => getKeyChar(i)}
      style={() => getKeyStyle(i)}
      title={() => getKeyTitle(i)}
      onToggleExclude={toggleExclude}
    />
  );

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <DragDropSensors>
        <div
          class="mx-auto w-full max-w-lg bg-[#444] rounded-[1.5cqw] p-[0.8cqw] overflow-hidden cursor-pointer"
          style={{ "container-type": "inline-size" }}
          onClick={props.onCopyLayout}
        >
          <Show when={boardGeom()}>
            {(geom) => {
              const shape = Array.from(props.dof()!.shape());
              const total = totalMainKeys(shape);
              return (
                <div
                  class="relative w-full"
                  style={{
                    "aspect-ratio": `100 / ${geom().heightCss}`,
                    "font-size": `${geom().fontSizeCqw.toFixed(2)}cqw`,
                    "line-height": "0",
                  }}
                >
                  <For each={Array.from({ length: total }, (_, i) => i)}>
                    {(flatIdx) => {
                      const { kw, ym, minX, minY } = geom();
                      const [r, c] = flatToRowCol(flatIdx, shape);
                      const pk = geom().board[r]?.[c];
                      if (!pk) return null;
                      return (
                        <div
                          class="absolute"
                          style={{
                            left: `${(pk.x - minX) * kw + GAP}%`,
                            top: `${(pk.y - minY) * kw * ym + GAP * ym}%`,
                            width: `${pk.width * kw - GAP * 2}%`,
                            height: `${(pk.height * kw - GAP * 2) * ym}%`,
                          }}
                        >
                          {renderKey(flatIdx)}
                        </div>
                      );
                    }}
                  </For>
                </div>
              );
            }}
          </Show>
        </div>
      </DragDropSensors>
    </DragDropProvider>
  );
}
