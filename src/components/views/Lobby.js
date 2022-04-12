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

  const startGame = () => {
    history.push(window.location.pathname+"/game");
  };
  const Return = () => {
    try { const response = api.put(window.location.pathname+"/users/"+localStorage.getItem("id")+"/leave");
    } catch (error) { alert(`Something went wrong while leaving the lobby: \n${handleError(error)}`);}
    history.push('/home');
    };

  let player1 = <Spinner/>;
  let player2 = <Spinner/>;
  let player3 = <Spinner/>;
  let player4 = <Spinner/>;

  useEffect(() => {
    async function fetchData() {
      try {
        const currentLobby = await api.get(window.location.pathname);
        const lobby = new Lobby(currentLobby.data);
        setLobby(currentLobby.data);

        let name1 = await api.get('/users/'+lobby.host_id);
        player1 = name1.data.username;

        for (let i = 0; i < lobby.total_players; i++){
            player2 = await api.get('/users/'+lobby.host_id);
        };

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
       } catch (error) {
         console.error(`Something went wrong while fetching the lobby: \n${handleError(error)}`);
         console.error("Details:", error);
         alert("Something went wrong while fetching the lobby! See the console for details.");
       }
     }

  //setInterval(refreshLobby, 3000);

  let startNow = null;
  let player_list = null;

  let content = <Spinner/>;



  if (lobby) {
    console.log("This is the current players amount, if its 2 or higher, start should appear. -> " + lobby.current_players);
    console.log("This is the id in the local storage (current user, the supposed host) -> " + localStorage.getItem('id'))
    console.log("This is the lobby.host_id. If its the same as the local storage id, the start button should appear. ->" + lobby.host_id)
    if ((lobby.current_players >= 2) && (localStorage.getItem('id') == lobby.host_id)) { // (lobby.current_players >= 2) && (localStorage.getItem('id') === lobby.host_id)
      startNow = (<Button className="lobby leave-button" onClick={() => startGame()}>
        Start
      </Button>)
    }
    //TODO: if at least 2 players and current user is host: set start now button to an actual button
    //TODO: add players
    content = (
    <div className="settings container">
      <div className="settings form">
        <h2>Name: {lobby.name}</h2>
        <h2>Players: {lobby.current_players}/{lobby.total_players}</h2>
      </div>
      </div>);
    player_list = (
    <div className="lobby players-container">
        <div>{player1}
        {player2}</div>
        <div>{player3}
        {player4}</div>
        </div>);
  }
  return (
      <BaseContainer className="lobby container">
      <div className="lobby buttons-container">
        <Button onClick={() => Return()}>
            &#60; Leave
          </Button>
          {startNow}
        </div>
        {content}
        {player_list}
      </BaseContainer>
    );

}
export default LobbyPage;