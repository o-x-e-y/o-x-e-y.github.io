import { A } from '@solidjs/router';

export default function Home() {
  return (
    <>
      <header>
        <h1>Oxey's layouts</h1>
      </header>
      <article>
        <section>
          This is where I'll keep all my layouts worth remembering.{' '}
          <A href="/playground">Layout Playground</A> is available for interactive analysis.
          I have a few categories:
          <h4>Absolutely worth using:</h4>
          <ul>
            <li><A href="/layouts/stronk">Stronk</A></li>
            <li><A href="/layouts/dhorf">Dhorf</A></li>
            <li><A href="/layouts/sturdy">Sturdy</A></li>
          </ul>
          <h4>For a specific audience:</h4>
          <ul>
            <li><A href="/layouts/noctum">Noctum</A></li>
            <li><A href="/layouts/compound">Compound</A></li>
          </ul>
          <h4>Old, do not recommend these anymore:</h4>
          <ul>
            <li><A href="/layouts/dvarf">Dvarf</A></li>
            <li><A href="/layouts/hands-up">Hands Up</A></li>
            <li><A href="/layouts/crest">Crest</A></li>
            <li><A href="/layouts/hands-right">Hands Right</A></li>
          </ul>
        </section>
      </article>
    </>
  );
}
