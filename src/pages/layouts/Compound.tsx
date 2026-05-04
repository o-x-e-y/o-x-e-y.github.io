import { A } from '@solidjs/router';
import LayoutPage from '../../components/LayoutPage';
import { keys, stats } from '../../data/compound';

export default function Compound() {
  return (
    <LayoutPage name="Compound" keys={keys} stats={stats}>
      <h2>Description</h2>
      <section>
        <p>
          Compound is basically a 2023 attempt at creating what <A href="/layouts/dvarf">Dvarf</A>{' '}
          aimed to be, being at least somewhat of a Dvorak derivative. It maintains about the same % usage Dvarf does{' '}
          with Dvorak, which can be increased by swapping <code>dk</code> (but which is not encouraged). It keeps the <code>mb</code> alt{' '}
          which I actually really enjoy from Dvorak, has pretty good sfbs, very good sfs for an `oe ui o` layout and{' '}
          besides <code>yo</code>, very good lsbs. Obviously <code>str</code> and <code>nts</code> hurt the Bad Redirects stat quite a bit, but you{' '}
          can get used to those pretty well even though if you haven't used dvorak before this is probably not the{' '}
          best layout.
        </p>
        <p>
          Learning over time that A: angle mod is pretty great and B: having stuff like <code>w</code> on vowel index top row
          creates some annoying bigrams with homerow middle, I moved <code>wp</code> to the bottom, which are now also closer
          to the left because of angle mod (which you should really use! Indexes like this become a bit messy if you
          don't because stuff like <code>pe</code>, <code>po</code> become much worse of a stretch. Mirroring is also an option if you don't
          already use Dvorak anyway).
        </p>
        <p>
          It has <code>lt</code> over something like <code>dtb</code> because otherwise you run into not being able to have a nice <code>bl</code> <i>and</i>{' '}
          <code>ld</code>, it forces <code>mb</code> to be a stretch while making an awful <code>lk</code> impossible. That is, unless you want to put{' '}
          <code>l</code> on homerow and <code>h</code> on bot row which I actually believe to be very good but means I don't get to keep <code>h</code>{' '}
          in its Dvorak position.
        </p>
      </section>
      <h2>Creation</h2>
      <section>
        <p>
          I basically went and took Dvarf, and saw what I could change about it following some ideas about layouts{' '}
          I have now. I reordered vowel index and looked at right index, mostly at ways to keep that <code>mb</code> alt that{' '}
          dvorak has. I initially ended up with <code>dtb</code> which has setups with lower sfbs/sfs overall, but eventually{' '}
          went with <code>lt</code> because it means I have less stretches, and less interaction with bot row overall which I{' '}
          think is a plus.
        </p>
        <p>
          I created an alternative version of this which cycles <code>vfkq</code>, having <code>k</code> up in the corner of right index
          but getting rid of the <code>tv</code> sfb and trading <code>fs</code> for <code>vs</code>, overall improving sfs quite a bit. This is an
          option if you don't mind that Dvorak <code>f</code> position as much. As pointed out there are also versions with <code>dtb</code>,
          but these ended up working much better with swapped indexes, i.e. <code>flhm</code> with vowels and then a <code>ck</code> alt on
          consonant index, but those didn't resemble the original enough for my taste.
        </p>
      </section>
      <h2>Thoughts</h2>
      <section>
        <p>
          Really do think this is solid as a Dvarf followup. I think <code>ld`/`bl</code> on Dvarf aren't great, and <code>lk</code> isn't as
          altable as I wish it was. While I actually think Dvarf holds up very well considering my experience at the
          time, I think this is a nice and well-deserved improvement over it. Definitely a solid pickup if you use
          Dvorak now and want to move to something else that's solid with a smaller learning curve.
        </p>
        <p>
          There are two things I want to point out though: as this is a mirror of what layouts usually look like, <code>yo</code>
          is much more of a stretch than if you were to have vowels on the right due to keyboard stagger, and because
          I wanted to keep some Dvorak similarity I used `oe ui a` which I believe to be slightly inferior to `oa ue i`
          (though this is still very much a viable setup). I believe the layout to be objectively better when mirrored
          with `oa ue i` vowels, but as I had different goals from usual for this layout, I didn't end up actually
          implementing these changes.
        </p>
      </section>
    </LayoutPage>
  );
}
