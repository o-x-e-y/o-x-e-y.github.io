import LayoutPage from '../../components/LayoutPage';
import { keys, stats } from '../../data/hands_right';

export default function HandsRight() {
  return (
    <LayoutPage name="Hands Right" keys={keys} stats={stats}>
      <h2>Description</h2>
      <section>
        <p>
          Hands left is basically the result of me salvaging Hands Up. The problem with Hands Up is its pinkies,
          so I just got rid of right pinky entirely and put it on index. I then reordered vowels to be similar to
          Semimak's and went from there.
        </p>
        <p>
          <code>p</code> had to go because <code>pr</code> is just terrible, so I moved that to right index as
          well as that was rather empty. Moving <code>v</code> to left pinky for some extra load there without the
          weird <code>pr</code> pattern gives me z or j for free to put somewhere else. Some index reordering and voilà,
          a layout with rolls only to the right is born.
        </p>
      </section>
      <h2>Thoughts</h2>
      <section>
        <p>
          First things first, I think this is an objective upgrade over Hands Up. There is a lot to be said about
          inrolls vs outrolls, but I don't think any of that justifies a <code>fhb</code> pinky and 1.2% bad
          redirects. Hands Up was a funny experiment, but it's not something I'd ever recommend over other layouts
          out there. That's different for this layout, it's virtually ready to be used right now.
        </p>
        <p>
          I will say that I honestly have a hard time gauging how mostly rolls to the right will feel. I assume
          it's not that different from most other layouts, but I will be using this layout at some point in the
          future, so by then I'll know more about that. I'll update this section when that rolls around. You can obviously
          also feel for yourself because this layout is more than ready for it!
        </p>
      </section>
    </LayoutPage>
  );
}
