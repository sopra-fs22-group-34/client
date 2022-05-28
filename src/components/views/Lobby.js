import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import Lobby from 'models/Lobby';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";
import Confirm from "./Confirm";

async function Kick(player) {
    try { await api.put("/lobbies/"+localStorage.getItem('lobby')+"/users/"+player+"/leave");
    } catch (error) { alert(`Something went wrong while kicking the user: \n${handleError(error)}`);}
}
function PlayerNameText({player=null}) {
  if (!player) {return (<Spinner/>)}
  else return (player)
}
function PlayerName(props) {
    if (props.isHost && props.player) return (<div className="lobby players-name"><PlayerNameText player={props.player}/><Button className="lobby kick-button" onClick={() => Kick(props.player)}>X</Button></div>)
    else return (<div className="lobby players-name"><PlayerNameText player={props.player}/></div>)
}
function publicToString(arg){
    if (arg) { return "Public";}
    return "Private";
}

const LobbyPage = () => {
  const history = useHistory();
  const [lobby, setLobby] = useState(null);
  const [hostBox, setHostBox] = useState(<PlayerName/>);
  const [p2Box, setP2Box] = useState(<PlayerName/>);
  const [p3Box, setP3Box] = useState(null);
  const [p4Box, setP4Box] = useState(null);
  const [full, setFull] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const togglePopup2 = () => {setIsOpen2(!isOpen2);}
  const [confirm, setConfirm] = useState(false);
  const togglePopup = () => {setConfirm(!confirm);}
  const [kicked, setKicked] = useState(false);
  const togglePopup3 = () => {setKicked(!kicked);}

  async function startGame() {
    try {
        await api.post("/lobbies/"+localStorage.getItem('lobby')+"/game");
        localStorage.setItem('game', localStorage.getItem('lobby'));
    }
    catch (error) {
        console.error(`Something went wrong while starting the game. : \n${handleError(error)}`);
        console.error("Details:", error);
    }
    history.push("/game");
  }
  async function Return() {
    try {
        await api.put("/lobbies/"+localStorage.getItem('lobby')+"/users/"+localStorage.getItem('id')+"/leave");
        history.push('/home');
    } catch (error) { console.error(`Something went wrong while leaving the lobby: \n${handleError(error)}`);}
    localStorage.removeItem('lobby');
  }

  function Redirect(){
      localStorage.removeItem('lobby');
      history.push('/home');
  }
  let p2 = null;
  let p3 = null;
  let p4 = null;

  let isHost = false;

  useEffect(() => {
    async function fetchData() {
      try {
        const currentLobby = await api.get("/lobbies/"+localStorage.getItem('lobby'));
        const lobby = new Lobby(currentLobby.data);
        setLobby(lobby);
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
        }
        if (lobby.current_players < 2) { p2 = null;}
        if (lobby.current_players < 3) { p3 = null;}
        if (lobby.current_players < 4) { p4 = null;}

        setP2Box(<PlayerName player={p2} isHost={isHost}/>);
        if (lobby.total_players >= 3) {setP3Box(<PlayerName player={p3} isHost={isHost}/>);}
        if (lobby.total_players === 4) {setP4Box(<PlayerName player={p4} isHost={isHost}/>);}
        console.log(lobby);

        const isInLobby = await api.get("/lobbies/"+localStorage.getItem('lobby') + "/users/" + localStorage.getItem('id'));
        if (!isInLobby.data) {
            setKicked(true);
        }

        if (lobby.current_players == lobby.total_players || !lobby.is_open) {
            setFull(true);
            await new Promise(resolve => setTimeout(resolve, 3000));
            startGame();
        }
      } catch (error) {
        setConfirm(true);
        console.error(`Something went wrong while fetching the lobby: \n${handleError(error)}`);
        console.error("Details:", error);
        localStorage.removeItem('lobby');
        //alert("Something went wrong while fetching the lobby! See the console for details.");
      }
    }
    const interval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  let startNow = null;

  let content = <Spinner/>;

  let fullText;
  if (full) { fullText = ("Lobby full! Game starting soon...");}
  else fullText = "";

  function LobbyStat(props){
      return (<div className="settings row">
      <div className="settings option"> {props.option}:</div>
      <div className="settings stat"> {props.stat}</div></div>)
  }

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
        <LobbyStat option="Name" stat={lobby.name}/>
        <LobbyStat option="Players" stat={lobby.current_players+"/"+lobby.total_players}/>
        <LobbyStat option="Timer" stat={lobby.timer}/>
        <LobbyStat option="Type" stat={publicToString(lobby.is_public)}/>
        {(!lobby.is_public) && <LobbyStat option="Secret Code" stat={(lobby.secret_url)}/>}
        </div>
      </div>);
  }
  return (
      <BaseContainer className="lobby container">
      {confirm && <Confirm content={<> </>} type="confirm" text="The host closed the lobby. Returning to Home." handleConfirm={Redirect}/>}
      {kicked && <Confirm content={<> </>} type="confirm" text="The host kicked you from the lobby. Returning to Home." handleConfirm={Redirect}/>}
      {isOpen2 && <Confirm content={<> </>} handleClose={togglePopup2} handleConfirm={Return}/>}
      <div className="lobby content">

      <div className="lobby buttons-container">
        <Button  className="blue-button" width="30%" onClick={togglePopup2}>
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
        {fullText}
        </div>
      </BaseContainer>
    );

}
export default LobbyPage;