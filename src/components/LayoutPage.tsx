import type { JSX } from 'solid-js';
import type { KeyData } from '../data/types';
import HomeButton from './HomeButton';
import Keyboard from './Keyboard';

interface Props {
  name: string;
  keys: KeyData[];
  stats: string;
  children: JSX.Element;
}

export default function LayoutPage(props: Props) {
  return (
    <>
      <HomeButton />
      <header>
        <h1>{props.name}</h1>
      </header>
      <article>
        <Keyboard keys={props.keys} />
        {props.children}
        <h2>Analyzer stats</h2>
        <section class="p-3">
          <div class="w-fit whitespace-pre">{props.stats}</div>
        </section>
      </article>
    </>
  );
}
