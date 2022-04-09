import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Overview.scss";

const LobbyOverview = () => {
  const history = useHistory();
  const [lobbies, setLobbies] = useState(null);
  const [user, setUser] = useState(null);

  const logout = () => {
    try { const response = api.put('/users/'+localStorage.getItem("id")+"/logout");
    } catch (error) { alert(`Something went wrong during the logout: \n${handleError(error)}`);}
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    history.push('/login');
  }

  const newGame = () => {
       history.push('/create');
    }

  const goToLobby = ({lobby}) => {
    //TODO: put request that adds current user to lobby
      history.push('/lobbies/'+lobby.id);
  }

  const Lobby = ({lobby}) => (
    <div className="lobby container">
      <div className="lobby username">{lobby.host_name}</div>
      <div className="lobby lobbyname">{lobby.name}</div>
      <div className="lobby players">{lobby.current_players}/{lobby.total_players}</div>
      <Button className="lobby join-button" onClick={() => goToLobby({lobby})}>
        Join &#62;
      </Button>
    </div>
  );

  Lobby.propTypes = {
    lobby: PropTypes.object
  };

  useEffect(() => {
      async function fetchData() {
        try {
          const player = await api.get('/users/'+localStorage.getItem("id"));
          setUser(player.data);

          const response = await api.get('/lobbies');
          await new Promise(resolve => setTimeout(resolve, 1000));
          setLobbies(response.data);

          console.log(response);
        } catch (error) {
          console.error(`Something went wrong while fetching the lobbies: \n${handleError(error)}`);
          console.error("Details:", error);
          alert("Something went wrong while fetching the lobbies! See the console for details.");
        }
      }
      fetchData();
    }, []);

  async function refreshLobbies() {
      try {
        const response = await api.get('/lobbies');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLobbies(response.data);
      } catch (error) {
        console.error(`Something went wrong while fetching the lobbies: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the lobbies! See the console for details.");
      }
    }

  setInterval(refreshLobbies, 10000);

  let content = <Spinner/>;
  let userName = "Player";
  let noGames = "";
  if (user) { userName = user.username; }
  if (lobbies) {
    if (lobbies.length === 0) {noGames = 'No open games found. Start your own by clicking on "New Game"!';}
    else {
    content = (
      <div className="overview">
        <ul className="overview lobby-list">
          {lobbies.map(lobby => (
            <Button className="overview lobby-button" width="100%"
                onClick={() => goToLobby({lobby})}>
              <Lobby lobby={lobby} key={lobby.id}/>
            </Button>
          ))}
        </ul>
      </div>)}
    }

    return (
        <BaseContainer className="overview container">
        <div className="overview welcome-container">
          <h2>Welcome, <span className="lobby username">{userName}</span>!</h2>
          <Button className="overview newgame-button" width="100%"
              onClick={() => newGame()}>
              New Game
            </Button>
          </div>
          <div className="overview lobby-container">
          <p className="overview paragraph">
            Games looking for players:
          </p>
          {content}
          {noGames}
          <Button width="80%" onClick={() => refreshLobbies()}>
              Refresh
            </Button>
          </div>
          <hr width="80%"/>
          <Button width="100%" onClick={() => logout()}>
            Logout
          </Button>
        </BaseContainer>
      );
    }

export default LobbyOverview;
