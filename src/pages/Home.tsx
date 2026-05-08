import { A } from "@solidjs/router";

export default function Home() {
  return (
    <>
      <header>
        <h1>Oxey's layouts</h1>
      </header>
      <article>
        <section>
          This is where I'll keep all my layouts worth remembering. I have a few categories:
          <h4>Absolutely worth using:</h4>
          <ul class="list-disc pl-8">
            <li>
              <A href="/layouts/stronk">Stronk</A>
            </li>
            <li>
              <A href="/layouts/dhorf">Dhorf</A>
            </li>
            <li>
              <A href="/layouts/sturdy">Sturdy</A>
            </li>
          </ul>
          <h4>For a specific audience:</h4>
          <ul class="list-disc pl-8">
            <li>
              <A href="/layouts/noctum">Noctum</A>
            </li>
            <li>
              <A href="/layouts/compound">Compound</A>
            </li>
          </ul>
          <h4>Old, do not recommend these anymore:</h4>
          <ul class="list-disc pl-8">
            <li>
              <A href="/layouts/dvarf">Dvarf</A>
            </li>
            <li>
              <A href="/layouts/hands-up">Hands Up</A>
            </li>
            <li>
              <A href="/layouts/crest">Crest</A>
            </li>
            <li>
              <A href="/layouts/hands-right">Hands Right</A>
            </li>
          </ul>
          <div>
            There is also the{" "}
            <A class="underline font-bold" href="/playground">
              Layout Playground
            </A>
            . This lets you:
            <ul class="list-disc pl-8">
              <li>Drag and drop swaps.</li>
              <li>Rightclick to disable/enable keys for analysis.</li>
              <li>See the changes you make in the stats displayed below.</li>
              <li>
                Choose from a variety of languages and layouts. More will be added sometime in the
                future!
              </li>
            </ul>
          </div>
        </section>
      </article>
    </>
  );
}
