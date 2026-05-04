import { createSignal, createMemo, createEffect, on, onMount, batch, For } from 'solid-js';
import { A } from '@solidjs/router';
import PlaygroundKeyboard from '../components/playground/PlaygroundKeyboard';
import LayoutSearch from '../components/playground/LayoutSearch';
import AnalysisPanel from '../components/playground/AnalysisPanel';
import { analyzeLayout } from '../lib/analyzer';
import type { LanguageData, AnalysisResult } from '../lib/analyzer';

// vmlcpqfouj / strdy.naei / zkxgwbh';, / =/␣⇧⇯-
const DEFAULT_LAYOUT = "vmlcpqfoujstrdy.naeizkxgwbh';,=/\u2423\u21E7\u21EF-";

const LANGUAGES: { label: string; value: string }[] = [
  { label: 'English', value: 'english' },
  { label: 'Albanian', value: 'albanian' },
  { label: 'Bokmal', value: 'bokmal' },
  { label: 'Czech', value: 'czech' },
  { label: 'Dutch', value: 'dutch' },
  { label: 'Dutch Repeat', value: 'dutch_repeat' },
  { label: 'English Repeat', value: 'english_repeat' },
  { label: 'English \u00FE', value: 'english_\u00FE' },
  { label: 'English2', value: 'english2' },
  { label: 'Esperanto', value: 'esperanto' },
  { label: 'Finnish', value: 'finnish' },
  { label: 'Finnish Repeat', value: 'finnish_repeat' },
  { label: 'French', value: 'french' },
  { label: 'French Qu', value: 'french_qu' },
  { label: 'German', value: 'german' },
  { label: 'Hebrew', value: 'hebrew' },
  { label: 'Hungarian', value: 'hungarian' },
  { label: 'Indonesian', value: 'indonesian' },
  { label: 'Italian', value: 'italian' },
  { label: 'Korean', value: 'korean' },
  { label: 'Malay', value: 'malay' },
  { label: 'Mt Quotes', value: 'mt_quotes' },
  { label: 'Nynorsk', value: 'nynorsk' },
  { label: 'Pinyin', value: 'pinyin' },
  { label: 'Pinyin AN', value: 'pinyin_an' },
  { label: 'Polish', value: 'polish' },
  { label: 'Portuguese', value: 'portuguese' },
  { label: 'Russian', value: 'russian' },
  { label: 'Spanish', value: 'spanish' },
  { label: 'Swedish', value: 'swedish' },
  { label: 'Swiss', value: 'swiss' },
  { label: 'Toki Pona', value: 'toki_pona' },
  { label: 'Tr Quotes', value: 'tr_quotes' },
  { label: 'Ukranian', value: 'ukranian' },
  { label: 'Welsh', value: 'welsh' },
  { label: 'Welsh Pure', value: 'welsh_pure' },
  { label: 'e200', value: 'e200' },
  { label: '450k', value: '450k' },
];

export default function Playground() {
  const [layout, setLayout] = createSignal(DEFAULT_LAYOUT);
  const [excludedIndices, setExcludedIndices] = createSignal(new Set<number>());
  const [languageData, setLanguageDataSignal] = createSignal<LanguageData | null>(null);
  const [language, setLanguage] = createSignal('english');

  const excludedChars = createMemo(() => {
    const lay = layout();
    return new Set([...excludedIndices()].map(i => lay[i]));
  });

  const analysis = createMemo<AnalysisResult | null>(() => {
    const ld = languageData();
    if (!ld) return null;
    return analyzeLayout(layout(), excludedChars(), ld);
  });

  const [prevAnalysis, setPrevAnalysis] = createSignal<AnalysisResult | null>(null);
  createEffect(on(analysis, (_curr, prev) => {
    setPrevAnalysis(prev ?? null);
  }));

  const loadLanguage = (lang: string, newLayout?: string) => {
    fetch(`/data/${lang}.json`)
      .then(r => r.json())
      .then((data: LanguageData) => {
        const ld = languageData();
        let converted: string;
        if (newLayout !== undefined) {
          converted = [...newLayout].map(c => data.convert[c] ?? c).join('');
        } else if (ld) {
          const back: Record<string, string> = {};
          for (const [k, v] of Object.entries(ld.convert)) back[v] = k;
          converted = [...layout()].map(c => {
            const reverted = back[c] ?? c;
            return data.convert[reverted] ?? reverted;
          }).join('');
        } else {
          converted = layout();
        }
        batch(() => {
          setLanguageDataSignal(data);
          setLayout(converted);
          setLanguage(lang);
        });
      })
      .catch(() => console.error(`Failed to load language: ${lang}`));
  };

  onMount(() => loadLanguage('english'));

  const copyLayout = () => {
    const lay = layout();
    const excl = excludedIndices();
    let text = '';
    for (let i = 0; i < 36; i++) {
      if (!excl.has(i)) text += lay[i];
    }
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}>
        <A href="/" style={{ color: '#aaa', 'text-decoration': 'none', 'font-size': '0.9rem' }}>
          ← Home
        </A>
      </div>
      <header>
        <h1>Layout Playground</h1>
      </header>
      <article style={{ 'max-width': '72rem' }}>
        <PlaygroundKeyboard
          layout={layout}
          setLayout={setLayout}
          excludedIndices={excludedIndices}
          setExcludedIndices={setExcludedIndices}
          languageData={languageData}
          onCopyLayout={copyLayout}
        />
        <div style={{
          'margin-top': 'max(0.7vh, 0.8vw)',
          'margin-bottom': 'max(0.52vh, 0.6vw)',
          'text-align': 'center',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        }}>
          <select
            value={language()}
            onChange={e => loadLanguage(e.currentTarget.value)}
            style={{
              'font-size': '100%',
              color: '#ddd',
              'background-color': '#333',
              border: '#ddd 1px solid',
              'border-radius': '0.2vw',
            }}
          >
            <For each={LANGUAGES}>
              {(lang) => <option value={lang.value}>{lang.label}</option>}
            </For>
          </select>
          <LayoutSearch onSelect={(lay, lang) => loadLanguage(lang, lay)} />
        </div>
        <AnalysisPanel analysis={analysis} prevAnalysis={prevAnalysis} />
      </article>
    </>
  );
}
