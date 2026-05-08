import { HashRouter, Route } from "@solidjs/router";
import Home from "./pages/Home";
import Playground from "./pages/Playground";
import Noctum from "./pages/layouts/Noctum";
import Compound from "./pages/layouts/Compound";
import Crest from "./pages/layouts/Crest";
import Dhorf from "./pages/layouts/Dhorf";
import Dvarf from "./pages/layouts/Dvarf";
import HandsRight from "./pages/layouts/HandsRight";
import HandsUp from "./pages/layouts/HandsUp";
import Stronk from "./pages/layouts/Stronk";
import Sturdy from "./pages/layouts/Sturdy";

export default function App() {
  return (
    <HashRouter>
      <Route path="/" component={Home} />
      <Route path="/playground" component={Playground} />
      <Route path="/layouts/noctum" component={Noctum} />
      <Route path="/layouts/compound" component={Compound} />
      <Route path="/layouts/crest" component={Crest} />
      <Route path="/layouts/dhorf" component={Dhorf} />
      <Route path="/layouts/dvarf" component={Dvarf} />
      <Route path="/layouts/hands-right" component={HandsRight} />
      <Route path="/layouts/hands-up" component={HandsUp} />
      <Route path="/layouts/stronk" component={Stronk} />
      <Route path="/layouts/sturdy" component={Sturdy} />
    </HashRouter>
  );
}
