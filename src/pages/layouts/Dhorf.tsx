import LayoutPage from '../../components/LayoutPage';
import { keys, stats } from '../../data/dhorf';

export default function Dhorf() {
  return (
    <LayoutPage name="Dhorf" keys={keys} stats={stats}>
      <h2>Description</h2>
      <section>
        <p>
          Dhorf is me taking Whorf and trying to make it more wieldy. This means that it mostly follows Whorf's{' '}
          goals of low sfb/sfs distance, but also on lsbs and scissors. It does quite well in all those aspects,{' '}
          creating one intentional alt (<code>tw</code>) in the process. Besides <code>mb</code> and <code>wh</code> there is very little that is{' '}
          obviously wrong with this layout.
        </p>
      </section>
      <h2>Creation</h2>
      <section>
        <p>
          I basically started with vanilla Whorf, from which I swapped away until I created something I really liked.{' '}
          I first moved <code>v</code> off right index and reordered indexes more to my liking, focusing both on giving keys{' '}
          comfortable positions for lsbs while also keeping sfb/sfs distance in mind. Changing <code>fs</code> into <code>vs</code> meant{' '}
          I remove the <code>fr</code> scissor and <code>hnb</code> into <code>hnm</code> removes <code>bl</code> and <code>br</code> from the equation.
        </p>
        <p>
          From there I initially moved <code>g</code> to left hand for a nice <code>ng</code> roll, but I eventually decided to move it{' '}
          back because I couldn't balance having a nice <code>dg</code> sfb with not making <code>nd</code> and <code>ng</code> a pain in the ass,{' '}
          not to mention something like <code>thing</code> being godawful. With angle mod and <code>dg</code> on bot row it might still{' '}
          be viable, but I don't really like it. This did mean I had to create a <code>tw</code> sfb, which works really well{' '}
          as an alt.
        </p>
        <p>
          I also considered taking more from sturdy by using <code>ji,</code> with <code>'</code> on index but eventually decided against{' '}
          it because it went against the idea that this layout should do really well on (non-altable) sfbs.
        </p>
      </section>
      <h2>Thoughts</h2>
      <section>
        <p>
          There is actually very little I don't like about this layout, besides <code>mb</code>, <code>wh</code> and the <code>rl</code> sfb. <code>th</code>{' '}
          felt a little awkward at first but eventually felt super natural, <code>tw</code> feels great and <code>hnm</code> works great{' '}
          as a column despite relatively high movement. Honestly as an all-round good layout this is probably the{' '}
          best I got, at least at this point.
        </p>
      </section>
    </LayoutPage>
  );
}
