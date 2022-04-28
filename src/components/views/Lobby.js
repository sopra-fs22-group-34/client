import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import Lobby from 'models/Lobby';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";

const Kick = ({player}) => {
    try { const response = api.put(window.location.pathname+"/users/"+player+"/leave");
    } catch (error) { alert(`Something went wrong while kicking the user: \n${handleError(error)}`);}
};

function PlayerNameText({player=null}) {
  if (!player) {return (<Spinner/>)}
  else return (player)
};

function PlayerName({player=null}, {isHost=false}) {
    if (!isHost) return (<div className="lobby players-name"><PlayerNameText player={player}/></div>)
    else return (<div className="lobby players-name"><PlayerNameText player={player}/><Button className="lobby kick-button" onClick={() => Kick({player})}>X</Button></div>)
};

const LobbyPage = () => {
  const history = useHistory();
  const [lobby, setLobby] = useState(null);
  const [hostBox, setHostBox] = useState(<PlayerName/>);
  const [p2Box, setP2Box] = useState(<PlayerName/>);
  const [p3Box, setP3Box] = useState(null);
  const [p4Box, setP4Box] = useState(null);

  const startGame = () => {
    history.push(window.location.pathname+"/game");
  };
  const Return = () => {
    try { const response = api.put(window.location.pathname+"/users/"+localStorage.getItem("id")+"/leave");
        history.push('/home');
    } catch (error) { alert(`Something went wrong while leaving the lobby: \n${handleError(error)}`);}
  };

  let host = null;
  let p2 = null;
  let p3 = null;
  let p4 = null;

  let isHost = false;

  useEffect(() => {
    async function fetchData() {
      try {
        const currentLobby = await api.get(window.location.pathname);
        const lobby = new Lobby(currentLobby.data);
        setLobby(currentLobby.data);

        if ((lobby.current_players >= 2) && (localStorage.getItem('id') == lobby.host_id)) { isHost = true; }

        setHostBox(<PlayerName player={lobby.host_name}/>);

        for (let i = 0; i < lobby.current_players; i++){
         if (i === 1){
             let name2 = await api.get('/users/'+lobby.players[i]);
             p2 = name2.data.username;
         } else if (i === 2){
             let name3 = await api.get('/users/'+lobby.players[i]);
             p3 = name3.data.username;
         } else if (i === 3){
             let name4 = await api.get('/users/'+lobby.players[i]);
             p4 = name4.data.username;
        }
        };
        if (lobby.current_players < 2) { p2 = null;}
        if (lobby.current_players < 3) { p3 = null;}
        if (lobby.current_players < 4) { p4 = null;}

        setP2Box(<PlayerName player={p2} isHost={isHost}/>);
        if (lobby.total_players >= 3) {setP3Box(<PlayerName player={p3} isHost={isHost}/>);}
        if (lobby.total_players === 4) {setP4Box(<PlayerName player={p4} isHost={isHost}/>);}
        console.log(currentLobby);

        const isInLobby = await api.get(window.location.pathname + "/users/" + localStorage.getItem('id'));
        if (!isInLobby.data) {history.push('/home');}
      } catch (error) {
        console.error(`Something went wrong while fetching the lobby: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the lobby! See the console for details.");
      }
    }
    const interval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  let startNow = null;

  let content = <Spinner/>;

  if (lobby) {
    if ((lobby.current_players >= 2) && (localStorage.getItem('id') == lobby.host_id)) {
      isHost = true;
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
        <div className="lobby players-container">
            {hostBox}
            {p2Box}
        </div>
        <div className="lobby players-container">
            {p3Box}
            {p4Box}
        </div>
      </BaseContainer>
    );

}
export default LobbyPage;