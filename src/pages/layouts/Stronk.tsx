import { A } from '@solidjs/router';
import LayoutPage from '../../components/LayoutPage';
import { keys, stats } from '../../data/stronk';

export default function Stronk() {
  return (
    <LayoutPage name="Stronk" keys={keys} stats={stats}>
      <h2>Description</h2>
      <section>
        <p>
          Stronk is essentially the result of me messing around with a lot of different homerow setups{' '}
          around having <code>str</code> as a onehand, eventually circling back to what is pretty close to{' '}
          <A href="/layouts/sturdy">Sturdy</A> with its indexes swapped. Besides the{' '}
          <code>str</code> constraint I also wanted low sfbs and sfs, preferrably aided by a few obvious sfbs that{' '}
          are easy to alt, which in this case would be primarily <code>nk</code>, <code>my</code> which if alted account for{' '}
          about 1/4th of all sfbs, and optionally <code>bv</code> and <code>ph</code>. I also wanted low bot row usage on{' '}
          non-index fingers, which due to how the layout fit together meant it basically has no usage{' '}
          there at all.
        </p>
        <p>
          I chose for the `oa eu i` vowel block because that's what I prefer, it's totally fine to use{' '}
          `oe ui a` or `eu oa i`, though in those cases it might be worth it to swap <code>g</code> and <code>w</code>. Doing{' '}
          something similar to Sturdy with the <code>ji,</code> pinky in this case isn't really possible unless you{' '}
          want to deal with <code>lr.</code> or sfbs with <code>'</code> on right index so <code>,i.</code> rather than anything unique in{' '}
          my opinion is the way to go.
        </p>
      </section>
      <h2>Creation</h2>
      <section>
        <p>
          This layout as I said came from me trying different things while keeping <code>str</code> on the homerow,{' '}
          which ended up becoming Stronk. I initially tried to create layouts with `vs dt lrm` on left{' '}
          pinky, ring and middle but due to the <code>rm</code> sfb and the way <code>m</code> interacted with <code>b</code>, I didn't{' '}
          end up sticking with it even though I think these layouts were quite good.
        </p>
        <p>
          The thing to change my mind ended up being the fact akl member ec0vid reminded me that putting{' '}
          <code>m</code> on the vowel index actually works surpringly well, minus the <code>my</code> sfb. There are obviously{' '}
          quite a few words with <code>my</code> or <code>ym</code> in it (it's about 0.12% sfbs total), but because simply <code>my</code>{' '}
          accounts for like 2/3rds of that I decided that this was still the superior spot, rather than{' '}
          keeping it with <code>lr</code>.
        </p>
        <p>
          This did mean that I had to reorder the left hand a bit because I needed to take either <code>p</code>, <code>g</code>{' '}
          or <code>w</code> off right hand due to the addition of <code>m</code>. <code>w</code> and <code>g</code> weren't an option as they don't fit{' '}
          any of the columns and <code>p</code> fit pretty well on index next to <code>p</code> as that's its most common sfb there.{' '}
          With an extra letter on left index I now also had to decide whether or not to having 6 &gt;1% usage{' '}
          letters there, which I did end up doing, moving <code>f</code> to pinky. I prefer <code>vs</code> for slightly lower pinky{' '}
          usage/movement but I didn't want to create lsbs with either <code>f</code> or <code>b</code> (or have <code>f</code> so far away in{' '}
          general) so this seemed like the best option.
        </p>
      </section>
      <h2>Thoughts</h2>
      <section>
        <p>
          Honestly really happy with how this turned out and I have started learning it. I think there is very{' '}
          little that sticks out to me at this point, the worst maybe being the <code>w</code> position or <code>br</code>. If those{' '}
          are the only things I end up disliking I will absolutely take that.
        </p>
      </section>
    </LayoutPage>
  );
}
