import { createSignal, createMemo, createEffect, on, onMount, batch, For } from "solid-js";
import PlaygroundKeyboard from "../components/playground/PlaygroundKeyboard";
import LayoutSearch from "../components/playground/LayoutSearch";
import AnalysisPanel from "../components/playground/AnalysisPanel";
import { analyzeLayoutDof } from "../lib/analyzer";
import type { LanguageData, AnalysisResult } from "../lib/analyzer";
import { Dof, dofToLayoutString } from "../lib/dof-utils";
import HomeButton from "../components/HomeButton";

const DEFAULT_LAYOUT_STRING = "vmlcpqfoujstrdy.naeizkxgwbh';,";
const DEFAULT_THUMB_KEYS = `=/\u2423\u21E7\u21EF-`;

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
  const rowStrs = [layoutStr.slice(0, 10), layoutStr.slice(10, 20), layoutStr.slice(20, 30)];
  const layerRows = rowStrs.map(s => s.split("").join(" "))
  return new Dof(
    JSON.stringify({
      name: "Custom",
      authors: [],
      board: "ortho",
      layers: { main: layerRows },
      fingering: "traditional",
      languages: {
        "english": 100
      },
    }),
  );
}

export default function Playground() {
  const [dof, setDof] = createSignal<Dof | null>(null);
  const [thumbKeys, setThumbKeys] = createSignal(DEFAULT_THUMB_KEYS);
  const [excludedIndices, setExcludedIndices] = createSignal(new Set<number>());
  const [languageData, setLanguageDataSignal] = createSignal<LanguageData | null>(null);
  const [language, setLanguage] = createSignal("english");

  const excludedChars = createMemo(() => {
    const d = dof();
    const tk = thumbKeys();
    const excl = excludedIndices();
    const chars = new Set<string>();
    if (!d) return chars;
    const mainStr = dofToLayoutString(d, tk);
    for (const i of excl) {
      if (mainStr[i]) chars.add(mainStr[i]);
    }
    return chars;
  });

  const analysis = createMemo<AnalysisResult | null>(() => {
    const d = dof();
    const ld = languageData();
    if (!d || !ld) return null;
    return analyzeLayoutDof(d, thumbKeys(), excludedChars(), ld);
  });

  const [prevAnalysis, setPrevAnalysis] = createSignal<AnalysisResult | null>(null);
  createEffect(
    on(analysis, (_curr, prev) => {
      setPrevAnalysis(prev ?? null);
    }),
  );

  const loadLanguage = (lang: string, newDof?: Dof, newThumbKeys?: string) => {
    const ld = languageData();
    const currentDof = dof();
    const currentThumb = thumbKeys();

    fetch(`/data/${lang}.json`)
      .then((r) => r.json())
      .then((data: LanguageData) => {
        let convertedDof: Dof;
        let convertedThumb: string;

        if (newDof !== undefined) {
          // Imported layout: convert canonical chars through language conversion map
          convertedDof = newDof;
          convertedThumb = newThumbKeys ?? currentThumb;
          convertedThumb = [...convertedThumb].map((c) => data.convert[c] ?? c).join("");
        } else if (ld && currentDof) {
          // Language switch: reverse-convert current layout then apply new language map
          const back: Record<string, string> = {};
          for (const [k, v] of Object.entries(ld.convert)) back[v] = k;
          const mainStr = dofToLayoutString(currentDof, currentThumb).slice(0, 30);
          const convertedStr = [...mainStr]
            .map((c) => {
              const reverted = back[c] ?? c;
              return data.convert[reverted] ?? reverted;
            })
            .join("");
          convertedDof = buildDefaultDof(convertedStr);
          convertedThumb = [...currentThumb]
            .map((c) => {
              const reverted = back[c] ?? c;
              return data.convert[reverted] ?? reverted;
            })
            .join("");
        } else {
          convertedDof = currentDof ?? buildDefaultDof(DEFAULT_LAYOUT_STRING);
          convertedThumb = currentThumb;
        }
        
        batch(() => {
          setLanguageDataSignal(data);
          setDof(convertedDof);
          setThumbKeys(convertedThumb);
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
    const fullStr = dofToLayoutString(d, thumbKeys());
    const excl = excludedIndices();
    let text = "";
    for (let i = 0; i < 36; i++) {
      if (!excl.has(i)) text += fullStr[i] ?? "";
    }
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <HomeButton />
      <header>
        <h1>Layout Playground</h1>
      </header>
      <article style={{ "max-width": "72rem" }}>
        <PlaygroundKeyboard
          dof={dof}
          setDof={setDof}
          thumbKeys={thumbKeys}
          setThumbKeys={setThumbKeys}
          excludedIndices={excludedIndices}
          setExcludedIndices={setExcludedIndices}
          languageData={languageData}
          onCopyLayout={copyLayout}
        />
        <div
          class="my-1 sm:mb-2 sm:mt-3"
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
              "font-size": "100%",
              color: "#ddd",
              "background-color": "#333",
              border: "#ddd 1px solid",
              "border-radius": "0.2vw",
            }}
          >
            <For each={LANGUAGES}>{(lang) => <option value={lang.value}>{lang.label}</option>}</For>
          </select>
          <LayoutSearch onSelect={(d, tk, lang) => loadLanguage(lang, d, tk)} />
        </div>
        <AnalysisPanel analysis={analysis} prevAnalysis={prevAnalysis} />
      </article>
    </>
  );
}
