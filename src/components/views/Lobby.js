import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import Lobby from 'models/Lobby';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";

const FormField = props => {
 return (
  <div className="settings field">
    <label className="settings label">
      {props.label}
    </label>
    <input className="settings input"
      placeholder={props.placeholder}
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
    />
  </div>
 );
};

FormField.propTypes = {
 label: PropTypes.string,
 value: PropTypes.string,
 placeholder: PropTypes.string,
 onChange: PropTypes.func
};

const Kick = ({player}) => {
    try { const response = api.put(window.location.pathname+"/users/"+player+"/leave");
    } catch (error) { alert(`Something went wrong while kicking the user: \n${handleError(error)}`);}
};

function PlayerNameText({player=null}) {
  if (!player) {return (<Spinner/>)}
  else return (player)
};

function PlayerName({player=null}, {isHost}) {
    if (!isHost) return (<div className="lobby players-name"><PlayerNameText player={player}/></div>)
    else return (<div className="lobby players-name"><PlayerNameText player={player}/><Button className="lobby kick-button" onClick={() => Kick({player})}>X</Button></div>)
};

const LobbyPage = () => {
  const history = useHistory();
  // states for lobby settings
  const [host_id, setHost_id] = useState(localStorage.getItem("id"));
  const [name, setName] = useState("New Game");
  const [total_players, setTotal_players] = useState(4);
  const [is_public, setIs_public] = useState(true);
  const [timer, setTimer] = useState(45);
  const [lobby, setLobby] = useState(null);
  // states for player displays
  const [hostBox, setHostBox] = useState(<PlayerName/>);
  const [p2Box, setP2Box] = useState(<PlayerName/>);
  const [p3Box, setP3Box] = useState(null);
  const [p4Box, setP4Box] = useState(null);

  const startGame = () => {
    history.push(window.location.pathname+"/game");
  };

  const Return = () => {
    if (window.location.pathname != "/create") {
        try { const response = api.put(window.location.pathname+"/users/"+localStorage.getItem("id")+"/leave");
        } catch (error) { console.error(`Something went wrong while leaving the lobby: \n${handleError(error)}`);}
    }
    history.push('/home');
  };

  const Open = async () => {
      try {
          const requestBody = JSON.stringify({host_id, name, is_public, total_players});
          const response = await api.post('/lobbies', requestBody);
          history.push("/lobbies/"+response.data.id);
      } catch (error) { alert(`Something went wrong while creating the lobby: \n${handleError(error)}`);
          history.push('/home');}
  };

  let host = null;
  let p2 = null;
  let p3 = null;
  let p4 = null;

  let isHost = false;
  let startNow = null;
  let leave = "Leave";

  useEffect(() => {
    console.log(window.location.pathname);

    async function lobbySettings() {
        try {
          setHost_id(localStorage.getItem("id"));
          setIs_public(true);
          setName("New Game");
          setTotal_players(4);
          setTimer(45);
        } catch (error) {
          console.error(`Something went wrong while initializing the new lobby: \n${handleError(error)}`);
          console.error("Details:", error);
          alert("Something went wrong while initializing the new lobby! See the console for details.");
        }
    }
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
      if (window.location.pathname == "/create") { lobbySettings(); }
      else { fetchData(); }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Game description/settings
  let settings = <Spinner/>;
  if (host_id || isHost) {
      leave = "Cancel";
      settings = (
        <div className="settings container">
        <div className="settings form">
          <FormField
            label="Name: "
            placeholder="New Game"
            value={name}
            onChange={ln => setName(ln)}
          />
          Players:
          <Button className="settings players-button" onClick={() => setTotal_players(2)}> 2 </Button>
          <Button className="settings players-button" onClick={() => setTotal_players(3)}> 3 </Button>
          <Button className="settings players-button" onClick={() => setTotal_players(4)}> 4 </Button>
        </div>
        </div>)
  };

  if (lobby) {
    leave = "Leave";
    if ((lobby.current_players >= 2) && (localStorage.getItem('id') == lobby.host_id)) {
      isHost = true;
      startNow = (<Button className="lobby leave-button" onClick={() => startGame()}>
        Start Now
      </Button>)
    }
    if (!isHost) {
    settings = (
    <div className="settings container">
      <div className="settings form">
        <h2>Name: {lobby.name}</h2>
        <h2>Players: {lobby.current_players}/{lobby.total_players}</h2>
      </div>
      </div>);
  }}

  // Player list or open button
  let players_container1 = <Spinner/>
  let players_container2 = null;
  if (window.location.pathname == "/create") {
      players_container1 = (
            <div className="lobby players-container">
                <Button width="100%" onClick={() => Open()}>
                  Open for Players
                </Button>
            </div>)}
  else {
      players_container1 = (
            <div className="lobby players-container">
                {hostBox} {p2Box}
            </div>)
      players_container2 = (
            <div className="lobby players-container">
                {p3Box} {p4Box}
            </div>
        )}

  return (
      <BaseContainer className="lobby container">
      <div className="lobby buttons-container">
        <Button onClick={() => Return()}>
            &#60; {leave}
          </Button>
          {startNow}
        </div>
        {settings}
        {players_container1}
        {players_container2}
      </BaseContainer>
    );

}
export default LobbyPage;
