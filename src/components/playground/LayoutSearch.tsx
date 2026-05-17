import { createSignal, For, Show } from "solid-js";
import layout_names from "../../data/layout_names";
import { Dof } from "../../lib/dof-utils";
import { Language } from "libdof";

interface Props {
  onSelect: (_dof: Dof, _language: string) => void;
}

function* getTrigrams(str: string): Generator<string> {
  if (!str) return;
  const padded = "  " + str + " ";
  for (let i = 0; i < padded.length - 2; i++) yield padded[i] + padded[i + 1] + padded[i + 2];
}

function searchLayouts(query: string, max = 7): string[] {
  const scores: Record<string, number> = {};
  const queryTrigrams = [...getTrigrams(query)];
  for (const name of layout_names) {
    for (const nt of getTrigrams(name)) {
      for (const qt of queryTrigrams) {
        if (nt === qt) scores[name] = (scores[name] ?? 0) + 1 / name.length;
      }
    }
  }
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([name]) => name);
}

export default function LayoutSearch(props: Props) {
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<string[]>([]);
  const [selectedIdx, setSelectedIdx] = createSignal(0);
  const [hovering, setHovering] = createSignal(false);

  const doSearch = (q: string) => {
    setResults(q ? searchLayouts(q) : []);
    setSelectedIdx(0);
  };

  const selectLayout = async (name: string) => {
    setResults([]);
    setQuery("");
    const res = await fetch(`/stored_layouts/${name}.dof`);
    const text = await res.text();
    const dof = new Dof(text);
    const language = (dof.languages() as Language[])[0];
    props.onSelect(dof, language.language);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        "margin-left": "1rem",
      }}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="search layout..."
          value={query()}
          onInput={(e) => {
            setQuery(e.currentTarget.value);
            doSearch(e.currentTarget.value);
          }}
          onFocus={(e) => doSearch(e.currentTarget.value)}
          onBlur={() => {
            if (!hovering()) setResults([]);
          }}
          onKeyDown={(e: KeyboardEvent) => {
            const res = results();
            if (!res.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelectedIdx((i) => (i + 1) % res.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelectedIdx((i) => (i - 1 + res.length) % res.length);
            } else if (e.key === "Enter") {
              e.preventDefault();
              selectLayout(res[selectedIdx()]);
            } else if (e.key === "Escape") {
              setResults([]);
            }
          }}
          class="w-[15.6vw] lg:w-[9.6vw]"
          style={{
            padding: "0.1vw",
            "background-color": "#444",
            color: "#ddd",
            border: "1px solid #aaa",
            "border-radius": "0.2vw",
            "font-size": "90%",
          }}
        />
      </form>
      <Show when={results().length > 0}>
        <div
          style={{
            position: "absolute",
            width: "100%",
            "background-color": "#aaa",
            border: "1px solid #aaa",
            "z-index": "10",
            display: "grid",
            "grid-auto-flow": "row",
            gap: "1px",
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => {
            setHovering(false);
          }}
        >
          <For each={results()}>
            {(name, i) => (
              <div
                style={{
                  padding: "0.2vw",
                  "background-color": i() === selectedIdx() ? "#555" : "#444",
                  color: "#ddd",
                  cursor: "pointer",
                  "font-size": "90%",
                }}
                onMouseEnter={() => setSelectedIdx(i())}
                onClick={() => selectLayout(name)}
              >
                {name}
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
