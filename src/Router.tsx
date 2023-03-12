import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
function Router() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <Switch>
        <Route path={["/tv", "/tv/:tvId"]}>
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path={["/", "/movies/:movieId"]}>
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
export default Router;
