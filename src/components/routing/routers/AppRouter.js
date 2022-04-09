import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import UserPage from "components/views/User";
import {EditGuard} from "components/routing/routeProtectors/EditGuard";
import EditPage from "components/views/Edit";
import LobbyOverview from "components/views/Overview";
import LobbyPage from "components/views/Lobby";
import CreatePage from "components/views/Create";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/game">
          <GameGuard>
            <GameRouter base="/game"/>
          </GameGuard>
        </Route>
        <Route path="/home">
          <GameGuard>
            <LobbyOverview/>
          </GameGuard>
        </Route>
        <Route path="/create">
          <GameGuard>
            <CreatePage/>
          </GameGuard>
        </Route>
        <Route path="/users/edit/">
          <EditGuard>
            <EditPage/>
          </EditGuard>
        </Route>
        <Route path="/users/">
          <GameGuard>
            <UserPage/>
          </GameGuard>
        </Route>
        <Route path="/lobbies/">
          <GameGuard>
            <LobbyPage/>
          </GameGuard>
        </Route>
        <Route exact path="/login">
          <LoginGuard>
            <Login/>
          </LoginGuard>
        </Route>
        <Route exact path="/register">
          <LoginGuard>
            <Register/>
          </LoginGuard>
        </Route>
        <Route exact path="/">
          <Redirect to="/home"/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
