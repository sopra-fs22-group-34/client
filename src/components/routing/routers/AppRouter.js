import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Header from "components/views/Header";
import {HomeGuard} from "components/routing/routeProtectors/HomeGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import {LobbyGuard} from "components/routing/routeProtectors/LobbyGuard";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import {GameOverGuard} from "components/routing/routeProtectors/GameOverGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import {UserPage} from "components/views/User";
import UserList from "components/views/UserList";
import {EditGuard} from "components/routing/routeProtectors/EditGuard";
import EditPage from "components/views/Edit";
import LobbyOverview from "components/views/Overview";
import LobbyPage from "components/views/Lobby";
import CreatePage from "components/views/Create";
import GamePage from "components/views/Game";
import RulesPage from "components/views/Rules";
import WinnerPage from "../../views/Winner";

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
        <Route exact path = "/game/over">
          <GameOverGuard>
            <WinnerPage/>
          </GameOverGuard>
        </Route>
        <Route path="/game">
          <GameGuard>
            <GamePage/>
          </GameGuard>
        </Route>
        <Route path="/home">
          <HomeGuard>
            <Header height="100"/>
            <LobbyOverview/>
          </HomeGuard>
        </Route>
        <Route path="/create">
          <HomeGuard>
            <Header height="100"/>
            <CreatePage/>
          </HomeGuard>
        </Route>
        <Route exact path="/users">
          <HomeGuard>
            <Header height="100"/>
            <UserList/>
          </HomeGuard>
        </Route>
        <Route path="/users/edit/">
          <EditGuard>
            <Header height="100"/>
            <EditPage/>
          </EditGuard>
        </Route>
        <Route path="/users/">
          <HomeGuard>
            <Header height="100"/>
            <UserPage/>
          </HomeGuard>
        </Route>
        <Route path="/lobby">
          <LobbyGuard>
            <Header height="100"/>
            <LobbyPage/>
          </LobbyGuard>
        </Route>
        <Route exact path="/login">
          <LoginGuard>
            <Header height="100"/>
            <Login/>
          </LoginGuard>
        </Route>
        <Route exact path="/register">
          <LoginGuard>
            <Header height="100"/>
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
