import LayoutPage from "../../components/LayoutPage";
import { stats } from "../../data/hands_up";

export default function HandsUp() {
  return (
    <LayoutPage name="Hands Up" layoutFile="hands up" stats={stats}>
      <h2>Description</h2>
      <section>
        <p>
          Hands up came to be because I wanted a layout that focuses almost entirely on inrolls and
          low redirects. <a href="https://github.com/semilin/genkey">Genkey</a> was the perfect tool
          to get a rough idea for
        </p>
        <p>
          this, starting from a <code>nrst</code> and <code>hiea</code> homerow it was able to get
          good columns very quickly, I didn't really handmake a lot of this.
        </p>
        <p>
          Inevitably this was to the cost of some patterns like <code>cr</code>, <code>fi</code>,{" "}
          <code>pr</code> and <code>gl</code>. It also has higher dsfbs than you might find on other
          layouts, though keep in mind about 0.8% of this can be attributed to the <code>oe</code>{" "}
          column. was mostly index reordering and getting rid of <code>pnb</code> on pinky, which
          was something genkey liked a lot but is obviously not good in practice.
        </p>
        <p>
          With this I got a layout with a <i>lot</i> of inrolls, something which I hadn't really
          seen anywhere else. Later I did find out that it's only a handful of swaps away from
          balance-12, a fact I was completely oblivious of until much later.
        </p>
      </section>
      <h2>Thoughts</h2>
      <section>
        <p>
          While redirects are low in total, the ones it has are generally pretty terrible: try
          typing <code>before</code> on this for example. There are far more weird patterns than I
          anticipated, and for this reason I wouldn't recommend it over many other layouts currently
          out there.
        </p>
        <p>
          What I will say is that having <code>n</code> on consonant hand pinky does show a lot of
          potential and I will definitely explore this further since it gives very good redirects
          and inrolls, to the detriment of basically nothing. Hands up with its pinky on index and a
          semimak-like vowel setup would already be a step at solving some of its current issues for
          example while keeping the insane inrolls on consonant hand.
        </p>
        <p>
          Another thing I noticed about <code>hiea</code> homerow layouts is that punctuation is
          always really nicely accessible, which can be very useful. Something I don't like is how
          things like <code>.</code>
          and <code>,</code> can be really far away or on the same fingers as I do all other punct
          and numbers with, an issue which these layouts don't have.
        </p>
      </section>
    </LayoutPage>
  );
}
