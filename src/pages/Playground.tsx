import { createSignal, createMemo, createEffect, on, onMount, batch, For } from "solid-js";
import PlaygroundKeyboard from "../components/playground/PlaygroundKeyboard";
import LayoutSearch from "../components/playground/LayoutSearch";
import AnalysisPanel from "../components/playground/AnalysisPanel";
import { analyzeLayoutDof } from "../lib/analyzer";
import type { LanguageData, AnalysisResult } from "../lib/analyzer";
import { Dof, dofToLayoutString } from "../lib/dof-utils";
import HomeButton from "../components/HomeButton";

const DEFAULT_LAYOUT_STRING = "vmlcpqfoujstrdy.naeizkxgwbh';,=/␣⇑↻-";

const LANGUAGES: { label: string; value: string }[] = [
  { label: "English", value: "english" },
  { label: "Albanian", value: "albanian" },
  { label: "Bokmal", value: "bokmal" },
  { label: "Czech", value: "czech" },
  { label: "Dutch", value: "dutch" },
  { label: "Dutch Repeat", value: "dutch_repeat" },
  { label: "English Repeat", value: "english_repeat" },
  { label: "English \u00FE", value: "english_\u00FE" },
  { label: "English2", value: "english2" },
  { label: "Esperanto", value: "esperanto" },
  { label: "Finnish", value: "finnish" },
  { label: "Finnish Repeat", value: "finnish_repeat" },
  { label: "French", value: "french" },
  { label: "French Qu", value: "french_qu" },
  { label: "German", value: "german" },
  { label: "Hebrew", value: "hebrew" },
  { label: "Hungarian", value: "hungarian" },
  { label: "Indonesian", value: "indonesian" },
  { label: "Italian", value: "italian" },
  { label: "Korean", value: "korean" },
  { label: "Malay", value: "malay" },
  { label: "Mt Quotes", value: "mt_quotes" },
  { label: "Nynorsk", value: "nynorsk" },
  { label: "Pinyin", value: "pinyin" },
  { label: "Pinyin AN", value: "pinyin_an" },
  { label: "Polish", value: "polish" },
  { label: "Portuguese", value: "portuguese" },
  { label: "Russian", value: "russian" },
  { label: "Spanish", value: "spanish" },
  { label: "Swedish", value: "swedish" },
  { label: "Swiss", value: "swiss" },
  { label: "Toki Pona", value: "toki_pona" },
  { label: "Tr Quotes", value: "tr_quotes" },
  { label: "Ukranian", value: "ukranian" },
  { label: "Welsh", value: "welsh" },
  { label: "Welsh Pure", value: "welsh_pure" },
  { label: "e200", value: "e200" },
  { label: "450k", value: "450k" },
];

function buildDefaultDof(layoutStr: string): Dof {
  const mainStr = layoutStr.slice(0, 30);
  const thumbStr = layoutStr.slice(30, 36);
  const layerRows = [
    mainStr.slice(0, 10).split("").join(" "),
    mainStr.slice(10, 20).split("").join(" "),
    mainStr.slice(20, 30).split("").join(" "),
    [...thumbStr].join(" "),
  ];
  return new Dof(
    JSON.stringify({
      name: "Custom",
      authors: [],
      board: "ortho",
      layers: { main: layerRows },
      fingering: "traditional",
      languages: { english: 100 },
    }),
  );
}

export default function Playground() {
  const [dof, setDof] = createSignal<Dof | null>(null);
  const [excludedIndices, setExcludedIndices] = createSignal(new Set<number>());
  const [languageData, setLanguageDataSignal] = createSignal<LanguageData | null>(null);
  const [language, setLanguage] = createSignal("english");

  const excludedChars = createMemo(() => {
    const d = dof();
    const excl = excludedIndices();
    const chars = new Set<string>();
    if (!d) return chars;
    const mainStr = dofToLayoutString(d);
    for (const i of excl) {
      if (mainStr[i]) chars.add(mainStr[i]);
    }
    return chars;
  });

  const analysis = createMemo<AnalysisResult | null>(() => {
    const d = dof();
    const ld = languageData();
    if (!d || !ld) return null;
    return analyzeLayoutDof(d, excludedChars(), ld);
  });

  const [prevAnalysis, setPrevAnalysis] = createSignal<AnalysisResult | null>(null);
  createEffect(
    on(analysis, (_curr, prev) => {
      setPrevAnalysis(prev ?? null);
    }),
  );

  const loadLanguage = (lang: string, newDof?: Dof) => {
    const ld = languageData();
    const currentDof = dof();

    fetch(`/data/${lang}.json`)
      .then((r) => r.json())
      .then((data: LanguageData) => {
        let convertedDof: Dof;

        if (newDof !== undefined) {
          convertedDof = newDof;
        } else if (ld && currentDof) {
          // Language switch: reverse-convert current main chars then apply new language map
          const back: Record<string, string> = {};
          for (const [k, v] of Object.entries(ld.convert)) back[v] = k;
          const fullStr = dofToLayoutString(currentDof);
          const convertedMain = fullStr
            .slice(0, 30)
            .split("")
            .map((c) => data.convert[back[c] ?? c] ?? back[c] ?? c)
            .join("");
          convertedDof = buildDefaultDof(convertedMain + fullStr.slice(30));
        } else {
          convertedDof = currentDof ?? buildDefaultDof(DEFAULT_LAYOUT_STRING);
        }

        batch(() => {
          setLanguageDataSignal(data);
          setDof(convertedDof);
          setLanguage(lang);
        });
      })
      .catch(() => console.error(`Failed to load language: ${lang}`));
  };

  onMount(() => {
    const defaultDof = buildDefaultDof(DEFAULT_LAYOUT_STRING);
    setDof(defaultDof);
    loadLanguage("english");
  });

  const copyLayout = () => {
    const d = dof();
    if (!d) return;
    const fullStr = dofToLayoutString(d);
    const excl = excludedIndices();
    let text = "";
    for (let i = 0; i < fullStr.length; i++) {
      if (!excl.has(i)) text += fullStr[i];
    }
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <HomeButton />
      <header>
        <h1>Layout Playground</h1>
      </header>
      <article style={{ "max-width": "80vw" }}>
        <PlaygroundKeyboard
          dof={dof}
          setDof={setDof}
          excludedIndices={excludedIndices}
          setExcludedIndices={setExcludedIndices}
          languageData={languageData}
          onCopyLayout={copyLayout}
        />
        <div
          class="my-1 sm:mb-2 sm:mt-2"
          style={{
            "text-align": "center",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
          }}
        >
          <select
            value={language()}
            onChange={(e) => loadLanguage(e.currentTarget.value)}
            style={{
              "padding": "1px",
              "padding-left": "4px",
              "font-size": "100%",
              color: "#ddd",
              "background-color": "#333",
              border: "#ddd 1px solid",
              "border-radius": "0.1vw",
            }}
          >
            <For each={LANGUAGES}>{(lang) => <option value={lang.value}>{lang.label}</option>}</For>
          </select>
          <LayoutSearch onSelect={(d, lang) => loadLanguage(lang, d)} />
        </div>
        <AnalysisPanel analysis={analysis} prevAnalysis={prevAnalysis} />
      </article>
    </>
  );
}
