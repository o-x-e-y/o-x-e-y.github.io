import LayoutPage from '../../components/LayoutPage';
import { keys, stats } from '../../data/sturdy';

export default function Sturdy() {
  return (
    <LayoutPage name="Sturdy" keys={keys} stats={stats}>
      <h2>Description</h2>
      <section>
        <p>
          Sturdy is my attempt at making a layout that has very high rolls while at the same time minimizing
          redirects, and then bad redirects (defined as any redirect not involving index) especially. I also
          wanted pinkies to have relatively low usage and finger speed, which this fit perfectly. It was made
          with the help of <a href="https://github.com/O-X-E-Y/oxeylyzer">my self-made layout analyzer</a>. In fact
          I'd argue most of the work going into this layout was getting my analyzer to output what I wanted! :)
        </p>
        <p>
          Because I have an <code>lr</code> left middle column, left index especially picks up a lot of the slack. This is
          not always good, but the way these indexes are set up now being built around <code>d</code> and <code>y</code>, all sfbs in{' '}
          <code>dy</code>, <code>cyc</code>, <code>dg</code> are actually really close to each other. Especially with angle mod keys and
          consequently your fingers stay very close to where the action is happening. For reference angle mod
          moves the 5 bottom left keys one to the left (moving <code>z</code> to qwerty <code>b</code> if you're on ansi), though
          you keep hitting the same keys with the same finger. <code>n.</code> is <i>relatively</i> common (in optimized
          layout terms) but can become a very nice alt later down the line.
        </p>
        <p>
          There are other candidates that I found fit this criteria (high rolls, low redirects), being <code>rnts</code>
          and <code>stnd</code>. Because <code>stnd</code> requires an <code>rn</code> middle column and <code>rnts</code> has an even higher usage/movement
          left index than Sturdy, I went with this as the final version.
        </p>
      </section>
      <h2>Thoughts</h2>
      <section>
        <p>
          This is by far my best layout to date. Having used it for a little bit (I'm only 80wpm with it
          currently, but improving!), the only annoyance I've found is <code>sk</code>. It's <i>somewhat</i> common and just
          feels pretty bad, going directly against the length of your fingers and forcing left middle to
          curl inward when you type it.
        </p>
        <p>
          I have some ideas about fixing this though. You could for example put it on middle and alt it in <code>rk</code>
          and <code>lk</code> if need be, but that didn't seem super ideal. Another option could be to put it on qwerty <code>b</code>
          moving <code>z</code> to that position, and alting it in <code>nk</code> and <code>ck</code>. That might actually be viable too, but
          I'd have to play around with it. If you wanna get really creative, making something like <code>cp</code> which
          has a near-zero frequency to be <code>sk</code> using something like ahk would also completely prevent this issue.
          For now I will just tank it which I think is also largely fine because 'somewhat common' still means
          you'll only get it maybe once every 2 tests or so.
        </p>
        <p>
          Another small concern is that a lot of words where <code>rl</code> occurs, it is followed by something on the
          left hand, like in <code>early</code> and <code>world</code>. This has not been a very big deal however, though if you only
          do monkeytype default wordlist, this layout might not be ideal for you because <code>rl</code> is very
          overrepresented in there.
        </p>
        <p>
          One cool thing my analyzer found however, is the <code>ji,</code> pinky with <code>.</code> on index. This gives your right
          pinky some breathing space (especially when doing quotes you use a lot of punctuation) while at the
          same time reducing the qwerty <code>l-&gt;p</code> pattern in what would otherwise be <code>e.</code>. These struggles then
          basically get transferred to index which can deal with it a lot better. Sturdy of course has this too.
        </p>
        <p>
          Wrapping up, for the (current?) price of <code>sk</code> you get balanced pinkies, low movement rings where
          left ring has no movement at all and right ring has <code>ue</code>, which is always a downwards slide,
          unproblematic rings and indexes that tank some of the required movement with some minor sfbs in <code>dy</code>,{' '}
          <code>dg</code>, <code>n.</code> and some smaller sfbs like that. From using it so far I can recommend it!
        </p>
      </section>
    </LayoutPage>
  );
}
