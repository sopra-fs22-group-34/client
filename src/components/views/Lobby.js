import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import Lobby from 'models/Lobby';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";

const PlayerName = ({player}) => (
  <div className="lobby players-name">{player}</div>
);

const LobbyPage = () => {
  const history = useHistory();
  const [lobby, setLobby] = useState(null);
  const [host, setHost] = useState(null);
  const [p2, setP2] = useState(<Spinner/>);
  const [p3, setP3] = useState(null);
  const [p4, setP4] = useState(null);

  const startGame = () => {
    history.push(window.location.pathname+"/game");
  };
  const Return = () => {
    try { const response = api.put(window.location.pathname+"/users/"+localStorage.getItem("id")+"/leave");
    } catch (error) { alert(`Something went wrong while leaving the lobby: \n${handleError(error)}`);}
    history.push('/home');
    };

  useEffect(() => {
    async function fetchData() {
      try {
        const currentLobby = await api.get(window.location.pathname);
        const lobby = new Lobby(currentLobby.data);
        setLobby(currentLobby.data);

        if (lobby.total_players >= 3) { setP3(<Spinner/>);}
        if (lobby.total_players === 4) { setP4(<Spinner/>);}

        let name1 = await api.get('/users/'+lobby.host_id);
        setHost(name1.data.username);

        for (let i = 0; i < lobby.current_players; i++){
            if (i === 1){
                let name2 = await api.get('/users/'+lobby.players[i]);
                setP2(name2.data.username);
            } else if (i === 2){
                let name3 = await api.get('/users/'+lobby.players[i]);
                setP3(name3.data.username);
            } else if (i === 3){
                let name4 = await api.get('/users/'+lobby.players[i]);
                setP4(name4.data.username);
            }
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
         setLobby(response.data);
         for (let i = 0; i < lobby.current_players; i++){
             if (i === 1){
                 let name2 = await api.get('/users/'+lobby.players[i]);
                 setP2(name2.data.username);
             } else if (i === 2){
                 let name3 = await api.get('/users/'+lobby.players[i]);
                 setP3(name3.data.username);
             } else if (i === 3){
                 let name4 = await api.get('/users/'+lobby.players[i]);
                 setP4(name4.data.username);
             }
         };
       } catch (error) {
         console.error(`Something went wrong while fetching the lobby: \n${handleError(error)}`);
         console.error("Details:", error);
         alert("Something went wrong while fetching the lobby! See the console for details.");
       }
     }

  setInterval(refreshLobby, 3000);

  let startNow = null;
  let player_list = null;
  let player_list3 = null;
  let player_list4 = null;

  let content = <Spinner/>;

  if (lobby) {
    if ((lobby.current_players >= 2) && (localStorage.getItem('id') === lobby.host_id)) { // (lobby.current_players >= 2) && (localStorage.getItem('id') === lobby.host_id)
      startNow = (<Button className="lobby leave-button" onClick={() => startGame()}>
        Start Now
      </Button>)
    }
    content = (
    <div className="settings container">
      <div className="settings form">
        <h2>Name: {lobby.name}</h2>
        <h2>Players: {lobby.current_players}/{lobby.total_players}</h2>
      </div>
      </div>);
    player_list = (
    <div className="lobby players-container">
        <PlayerName player={host}/> <PlayerName player={p2}/>
        </div>);
    if (lobby.total_players >= 3){player_list3 = (<PlayerName player={p3}/>);}
    if (lobby.total_players === 4){player_list4 = (<PlayerName player={p4}/>);}
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
        <div className="lobby players-container">
            {player_list3}
            {player_list4}
        </div>
      </BaseContainer>
    );

}
export default LobbyPage;