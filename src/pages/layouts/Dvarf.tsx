import LayoutPage from "../../components/LayoutPage";
import { stats } from "../../data/dvarf";

export default function Dvarf() {
  return (
    <LayoutPage name="Dvarf" layoutFile="dvarf" stats={stats}>
      <h2>Description</h2>
      <section>
        <p>
          Dvarf is essentially my attempt at modding Dvorak. The name is a combination of Dvorak,
          Whorf and Dwarf, which are the layouts it takes most of its inspiration from. It has 10
          keys that are the same as Dvorak, 9 if you go for the alternative punct setup with{" "}
          <code>;</code> on top left pinky.
        </p>
        <p>
          Initially I tried to stay as close to Dvorak as possible, but I pretty quickly realised
          there's not really a lot you can do to stay very true to it without creating something
          that's equally janky. You obviously can't keep the vowels as they are and there's sfbs on
          every single finger on the right hand. This means that in order to begin fixing everything
          that's wrong with Dvorak, you already have to change some 10 keys. At that point I just
          tried keeping the right hand homerow + <code>r</code> and go from there. <code>a</code>{" "}
          <code>ui</code> <code>oe</code> keeps at least 2 of the vowels the same so that is what I
          chose for the vowel block, the left index is straight from Whorf.
        </p>
        <p>
          This left the right hand to basically do what I wanted with it, which somehow ended up
          being far more constrained that I expected. If <code>dtb</code> wasn't a thing this layout
          would probably not exist. <code>r</code> was also helpful here because <code>rn</code> is
          a very comfy slide, there is literally no other place it could go. The keys that are in
          their original Dvorak positions account for about 55% of use, which all in all could
          honestly be worse.
        </p>
      </section>
      <h2>Thoughts</h2>
      <section>
        <p>
          The layout still has a lot of issues, but it has good sfb and decent dsfb, good rolls and
          not a lot of very weird patterns. <code>snth</code> is a surprisingly nice homerow to
          have. I like this vowel setup a lot, but it depends on the person. <code>i</code>{" "}
          <code>eu</code> <code>oa</code> could have also worked but that would have fewer keys in
          common with Dvorak. If you prefer ring over middle usage though, do consider this instead
          of the default setup.
        </p>
        <p>
          Its main problems however reside in its redirects. A byproduct of having <code>p</code>{" "}
          and <code>g</code> on the vowel hand is a bunch of strange redirects in words like{" "}
          <code>against</code> or <code>people</code>. This is further exacerbated by the fact these
          are on inner index which means they also bring a lot of lsbs in addition. I did this
          because I was fixated on keeping nice combinations with <code>ou</code> in{" "}
          <code>you</code>, <code>wou</code> and <code>cou</code> but they're really not as
          important as they were in my head at the time. This is not the end of the world, but it
          could be better. If I'd make this layout now I'd probably cycle <code>cygw</code>.
        </p>
        <p>
          There are also a few things on right hand that aren't ideal. To keep <code>ld</code> and{" "}
          <code>bl</code>
          sane I put <code>l</code> on inner index. I really don't think <code>bl</code> is as
          important nowadays and so I'd probably swap <code>lv</code>, but that still leaves{" "}
          <code>br</code>. Minor, but could be better of course.
        </p>
        <p>
          All in all though this is a decent layout, and coming from Dvorak myself I liked using it
          for a while. I would however strongly recommend the swaps I talk about here.
        </p>
      </section>
    </LayoutPage>
  );
}
