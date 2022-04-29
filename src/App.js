import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import GamePage from "components/views/Game";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
    if (window.location.pathname == "/game") { return (<div><GamePage/></div>)}
  return (
    <div>
      <Header height="100"/>
      <AppRouter/>
    </div>
  );
};

export default App;
