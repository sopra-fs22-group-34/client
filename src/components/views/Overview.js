import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Overview.scss";
import {buildGetRequestExternalAPI} from "./User";

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

  const newGame = async () => {
       try { let inLobby = await api.get('/users/' + localStorage.getItem("id") + '/lobbies/');
         if (inLobby.data == false) {history.push('/create');}
         else {alert(`You are already in a lobby! Please leave it before creating a new one.`)}
       } catch (error) { alert(`Something went wrong when trying to create a new lobby: \n${handleError(error)}`);}
    }

  const goToLobby = async ({lobby}) => {
      try { let inLobby = await api.get('/lobbies/'+lobby.id+'/users/'+localStorage.getItem("id"));
        if (inLobby.data == false) {await api.put('/lobbies/'+lobby.id+'/users/'+localStorage.getItem("id")+'/join');}
        history.push('/lobbies/'+lobby.id);
      } catch (error) { alert(`Something went wrong when joining the lobby: \n${handleError(error)}`);}
  }

  function Lobby({lobby}){
    if (lobby.current_players === lobby.total_players) return null;
    return (
    <div className="lobbies container">
      <div className="lobbies username">{lobby.host_name}</div>
      <div className="lobbies lobbyname">{lobby.name}</div>
      <div className="lobbies players">{lobby.current_players}/{lobby.total_players}</div>
      <Button className="lobbies join-button" onClick={() => goToLobby({lobby})}>
        Join &#62;
      </Button>
    </div>)
  };

  Lobby.propTypes = {
    lobby: PropTypes.object
  };

  useEffect(() => {
      async function fetchPlayerData() {
        try {
          const player = await api.get('/users/'+localStorage.getItem("id"));
          setUser(player.data);
        } catch (error) {
          console.error(`Something went wrong while fetching your user data: \n${handleError(error)}`);
          console.error("Details:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          history.push('/login');
        }
      }
      async function refreshLobbies() {
        try {
          const response = await api.get('/lobbies');
          setLobbies(response.data);
        } catch (error) {
          console.error(`Something went wrong while fetching the lobbies: \n${handleError(error)}`);
          console.error("Details:", error);
          alert("Something went wrong while fetching the lobbies! See the console for details.");
        }
      }
      const interval = setInterval(() => {
        refreshLobbies();
        }, 1000);
      fetchPlayerData();
      return () => clearInterval(interval);
    }, []);

  let contentProfilePicture;
  let content = <Spinner/>;
  let userName = "Player";
  let noGames = "";
  if (user) {
      userName = user.username;
      contentProfilePicture = (<img src={buildGetRequestExternalAPI(user.id)} width={50} length={50}/>);
   }
  if (lobbies) {
    if (lobbies.length === 0) {noGames = 'No open games found. Start your own by clicking on "New Game"!';}
    else {
    noGames = "";
    content = (
      <div className="overview">
        <ul className="overview lobby-list">
          {lobbies.map(lobby => (
            <Button className="overview lobby-button"
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
          <h2>Welcome, <span className="lobbies username">{userName}</span>!</h2>
            <div className="overview welcome-image"> {contentProfilePicture}</div>
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
          </div>
          <hr width="80%"/>
          <Button width="100%" onClick={() => logout()}>
            Logout
          </Button>
        </BaseContainer>
      );
    }

export default LobbyOverview;
