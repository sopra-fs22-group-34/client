import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import Lobby from 'models/Lobby';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";

const LobbyPage = () => {
  const history = useHistory();
  const [lobby, setLobby] = useState(null);
  const [host, setHost] = useState(null);
  const [players, setPlayers] = useState(null);

  const startGame = () => {
    history.push(window.location.pathname+"/game");
  }
  const Return = () => {
    try { const response = api.put(window.location.pathname+"/users/"+localStorage.getItem("id")+"/leave");
    } catch (error) { alert(`Something went wrong while leaving the lobby: \n${handleError(error)}`);}
    history.push('/home');
    }

    const LobbySettings = ({lobby}) => (
      <div className="settings container">
        <div className="settings username">{lobby.host_id}</div>
        <div className="settings lobbyname">{lobby.name}</div>
        <div className="settings players">{lobby.current_players}/{lobby.total_players}</div>
      </div>
    );
    LobbySettings.propTypes = {
      lobby: PropTypes.object
    };

    const Player = ({user}) => (
        <div className="player container">
        <div className="player name">{user.username}</div>
        </div>
    );
    Player.propTypes = {
      user: PropTypes.object
    };

  useEffect(() => {
    async function fetchData() {
      try {
        const currentLobby = await api.get(window.location.pathname);
        const lobby = new Lobby(currentLobby.data);
        setLobby(currentLobby.data);
        //setPlayers(lobby.players);
        console.log(currentLobby);
      } catch (error) {
        console.error(`Something went wrong while fetching the lobby: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the lobby! See the console for details.");
      }
    }
    fetchData();
  }, []);

  async function refreshLobby() {
       try {
         const response = await api.get(window.location.pathname);
         const lobby = new Lobby(response.data);
         setPlayers(lobby.players);
       } catch (error) {
         console.error(`Something went wrong while fetching the lobby: \n${handleError(error)}`);
         console.error("Details:", error);
         alert("Something went wrong while fetching the lobby! See the console for details.");
       }
     }

  //setInterval(refreshLobby, 3000);
  let playerCount = 4;
  let player1 = "";
  let player2 = <Spinner/>;
  let player3 = "";
  let player4 = "";
  let startNow = null;
  let player_list = null;

  if (lobby) {
    playerCount = lobby.total_players;
    //TODO: if at least 2 players and current user is host: set start now button to an actual button
    //TODO: add players
  }
  return (
      <BaseContainer className="lobby container">
      <div className="lobby buttons-container">
        <Button className="lobby leave-button" onClick={() => Return()}>
            &#60; Leave
          </Button>
          {startNow}
        </div>
        <LobbySettings lobby={lobby}/>
        <div className="lobby players-container">
          {player_list}
        </div>

      </BaseContainer>
    );

}
export default LobbyPage;

//<Button width="100%" onClick={() => logout()}>
//          Logout
//        </Button>