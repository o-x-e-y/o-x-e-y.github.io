import LayoutPage from "../../components/LayoutPage";
import { stats } from "../../data/crest";

export default function Crest() {
  return (
    <LayoutPage name="Crest" layoutFile="crest" stats={stats}>
      <h2>Description</h2>
      <section>
        <p>
          Crest is a layout I created because I was very impressed by the roll stats of Rollmak and
          Megamak. I especially thought the homerow was interesting because it seemed to be possible
          to stay fairly close to Colemak while solving a lot of the redirect issues it has.
        </p>
        <p>
          This I did not end up doing as Rollmak seemed to fill this role quite nicely. Instead, I
          tried to build on top of Rollmak and improve what was already there.
        </p>
        <p>
          My main goal was to keep weird patterns low, sometimes even to the detriment to some
          finger balance. Besides pinkies, both hand and finger balance were the least of my
          concerns while making this layout. Redirects I also cared less about, a change of pace
          from what I usually make. Last but not least is <code>n</code> on vowel index for the
          rolls that I wanted, curious to how that would work out compared to simply putting it on
          index.
        </p>
      </section>
      <h2>Thoughts</h2>
      <section>
        <p>
          This might be the most polished layout I have. Besides the redirects with <code>n</code>{" "}
          there is very little I can point to that I don't like. There is <code>wr</code>, but
          that's about it. Pinkies are good, patterns are good, I'm really happy with the result.
          There are however 3 pairs that you might want to consider swapping, depending on what you
          like.
        </p>
        <p>
          <code>bj</code> is a good swap candidate, I might actually make that the main layout, I'm
          not entirely sure. <code>b</code> is where it is currently because <code>be</code> and{" "}
          <code>ba</code> would not be great and from here those become slightly easier. This is a
          rowstag consideration though, on colstag definitely swap those.
        </p>
        <p>
          The other pair is <code>gw</code>. The current setup allows for a much easier{" "}
          <code>gl</code> than would otherwise be possible, moving some sfbs from index to ring in
          the process. There is however value in swapping those back, making <code>gl</code> worse
          but moving sfbs off of ring. I will say though that ring already doesn't have much to do,
          so a potentially slidable <code>sw</code> is certainly not the end of the world.
        </p>
        <p>
          Lastly you can consider a <code>,'w</code> cycle. This gets rid of <code>wr</code> which
          is great, but does leave you with <code>'</code> being in a bit of an awkward position,
          especially in something like <code>you'</code> this could be a problem. Still, it might be
          something to consider especially if you don't/can't slide <code>e,</code> which is
          surprisingly common.
        </p>
        <p>
          Speaking of work, this layout is pretty unbalanced. It's got a 45-55 workload, which means
          one hand will be working harder than the other, and it's got some interesting finger
          balances. Left index is about 18% use, while left middle and ring are both about 10%.
          Right ring is nearing 17% while right middle is about 16%, with index being just over 15%.
          You might want to consider this before starting out. It shouldn't affect your experience
          too much, but it's something to keep in mind. If you want to ease up on right ring (to the
          detriment of right pinky) you can swap <code>.</code> and <code>;</code>.
        </p>
        <p>
          In the end you get a layout very similar to Hands Left, something which I'm very happy
          with. Go try this!
        </p>
      </section>
    </LayoutPage>
  );
}
