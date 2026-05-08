import { createSignal, onMount, Show } from "solid-js";
import type { JSX } from "solid-js";
import HomeButton from "./HomeButton";
import Keyboard from "./Keyboard";
import type { LanguageData } from "../lib/analyzer";
import { Dof } from "../lib/dof-utils";

interface Props {
  name: string;
  layoutFile: string;
  stats: string;
  children: JSX.Element;
}

export default function LayoutPage(props: Props) {
  const [dof, setDof] = createSignal<Dof | null>(null);
  const [languageData, setLanguageData] = createSignal<LanguageData | null>(null);

  onMount(async () => {
    const [dofRes, langRes] = await Promise.all([
      fetch(`/stored_layouts/${props.layoutFile}.dof`),
      fetch("/data/english.json"),
    ]);
    const [dofText, langData] = await Promise.all([dofRes.text(), langRes.json()]);
    setDof(new Dof(dofText));
    setLanguageData(langData as LanguageData);
  });

  return (
    <>
      <HomeButton />
      <header>
        <h1>{props.name}</h1>
      </header>
      <article>
        <Show when={dof() && languageData()}>
          <Keyboard dof={dof()!} languageData={languageData()!} />
        </Show>
        {props.children}
        <h2>Analyzer stats</h2>
        <section class="p-3">
          <div class="w-fit whitespace-pre">{props.stats}</div>
        </section>
      </article>
    </>
  );
}
