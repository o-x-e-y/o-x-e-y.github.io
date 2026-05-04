import { A } from '@solidjs/router';
import LayoutPage from '../../components/LayoutPage';
import { keys, stats } from '../../data/noctum';

export default function Noctum() {
  return (
    <LayoutPage name="Noctum" keys={keys} stats={stats}>
      <h2>Description</h2>
      <section>
        <p>
          Noctum is essentially me messing around with <code>nrts</code> layouts to say 'hey, what would happen if I swapped{' '}
          <code>s</code> and <code>r</code>?' It makes some compromises by creating some sfbs on left index but otherwise should work{' '}
          really well. By having a <code>c</code> vowel index I could create a <code>fsv</code> column to minimize bot row usage.
          Because all sfbs on the <code>r</code> index are with <code>r</code> or <code>l</code>, keys there are arranged in a way that the most
          common sfbs are the easiest to alt. <code>b</code> should also sit pretty together with <code>n</code>, as they basically
          don't interact. <code>dtm</code> also works really well as a column, though it does make <code>rl</code> in <code>rld</code> somewhat
          awkward to alt. Overall Noctum minimizes redirects while creating a nice balance of (in)rolls and
          alternation, all while having some really nice onehands to boot.
        </p>
      </section>
      <h2>Creation</h2>
      <section>
        <p>
          As pointed out, I basically messed around with <code>nrts</code> to create this. This did mean that initially it{' '}
          had <code>h</code> on right hand like Gallium, Graphite, being forced into a <code>csw</code> ring column with <code>dtg</code> on middle{' '}
          just to make it work. Figuring out that I could put <code>h</code> on left index as well meant that a lot of things{' '}
          fell into place where <code>w</code>, <code>c</code> and <code>g</code> found positions they actually work well at.
        </p>
      </section>
      <h2>Thoughts</h2>
      <section>
        <p>
          Noctum creates really nice <code>nst</code> and <code>str</code> onehands yes, but leaves some questions to be answered. <code>dtm</code>
          felt like a nobrainer as did <code>bn</code>, but some words like <code>number</code> actually have a lot of up and down
          movement I really didn't enjoy even though none of these movements are scissors, something I was keeping a
          close eye on then. This is also unfortunately true for that <code>h</code> position: while it looks decent in theory,
          stuff like <code>thr</code> feels really awful and almost invalidates the whole layout for me, even though the rest is
          honestly pretty great. I hit 100wpm with this layout but I dropped it after. I don't think I can recommend
          this layout over <A href="/layouts/sturdy">Sturdy</A>,{' '}
          <A href="/layouts/stronk">Stronk</A> or{' '}
          <A href="/layouts/dhorf">Dhorf</A> at this point.
        </p>
      </section>
    </LayoutPage>
  );
}
