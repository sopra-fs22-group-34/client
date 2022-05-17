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
  const [game, setGame] = useState(null);
  const [view, setView] = useState("join");

  async function logout() {
    try { await api.put('/users/'+localStorage.getItem('id')+"/logout");
    } catch (error) { alert(`Something went wrong during the logout: \n${handleError(error)}`);}
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('lobby');
    history.push('/login');
  }

  const userList = () => {
    history.push('/users');
  }

  const newGame = async () => {
       try {
         if (user.lobby == 0) {history.push('/create');}
         else {alert(`You are already in a game! Please leave it before creating a new one.`)}
       } catch (error) { alert(`Something went wrong when trying to create a new lobby: \n${handleError(error)}`);}
    }

  const goToLobby = async ({lobby}) => {
      try {
        if (lobby.id != user.lobby) {await api.put('/lobbies/'+lobby.id+'/users/'+localStorage.getItem("id")+'/join');}
        localStorage.setItem('lobby', lobby.id);
        history.push('/lobbies/'+lobby.id);
      } catch (error) { alert(`Something went wrong when joining the lobby: \n${handleError(error)}`);}
  }
  const spectateLobby = async ({lobby}) => {
        try {
          if (lobby.id != user.lobby) {await api.put('/lobbies/'+lobby.id+'/users/'+localStorage.getItem("id")+'/spectate');}
          localStorage.setItem('lobby', lobby.id);
          history.push('/game');
        } catch (error) { console.error("Details:", error);}
    }

  function Lobby({lobby}){
    let text = "Join";
    if (view == "spectate") text = "Watch";
    return (
    <div className="lobbies container">
      <div className="lobbies username">{lobby.host_name}</div>
      <div className="lobbies lobbyname">{lobby.name}</div>
      <div className="lobbies players">{lobby.current_players}/{lobby.total_players}</div>
      <div className="lobbies join-button"> {text} &#62; </div>
    </div>)
  }

  Lobby.propTypes = {
    lobby: PropTypes.object
  };

  useEffect(() => {
      async function fetchPlayerData() {
        try {
          const player = await api.get('/users/'+localStorage.getItem('id'));
          setUser(player.data);
        } catch (error) {
          console.error(`Something went wrong while fetching your user data: \n${handleError(error)}`);
          console.error("Details:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          localStorage.removeItem('lobby');
          history.push('/login');
        }
      }
      async function isUserInGame() {
          try {
            const inGame = await api.get('/users/'+localStorage.getItem('id')+'/game');
            setGame(inGame.data);
          } catch (error) {
            console.error(`Something went wrong while determining if you are in a game: \n${handleError(error)}`);
            console.error("Details:", error);
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
      isUserInGame();
      return () => clearInterval(interval);
    }, []);

  let contentProfilePicture;
  let content = <Spinner/>;
  let userName = "Player";
  let noGames = "";
  let buttons;

  function openLobbies(lobbies){
    for (let i = 0; i < lobbies.length; i++){
      if (isVisible(lobbies[i])) return true;
    }
    return false;
  }
  function isVisible(lobby){
    return lobby.is_open && !lobby.is_private;
  }
  function lobbiesToSpectate(lobbies){
      for (let i = 0; i < lobbies.length; i++){
        if (canBeSpectated(lobbies[i])) return true;
      }
      return false;
    }
    function canBeSpectated(lobby){
      return !lobby.is_open;
    }

  if (game){
    content = (<p>You are currently in a game! Return to it <a href="/game"> here</a>!</p>);
  } else if (view == "join") {
      buttons = (<div className="overview button-container">
                     <Button className="join-buttons L" onClick={() => setView("join")}> Play </Button>
                     <Button className="join-buttons R-inactive" onClick={() => setView("spectate")}> Spectate </Button>
                 </div>);
      if (lobbies) {
          if (!openLobbies(lobbies)) {
            content = <Spinner/>;
            noGames = 'No open games found. Start your own by clicking on "New Game"!';
            }
          else {
              noGames = "";
              if (!game) {
                  content = (
                    <div className="overview view-description">
                    <p className="overview paragraph"> Games looking for players: <hr/></p>
                      <ul className="overview lobby-list">
                        {lobbies.map(lobby => (
                          isVisible(lobby) && <Button className="overview lobby-button"
                              onClick={() => goToLobby({lobby})}>
                            <Lobby lobby={lobby} key={lobby.id}/> </Button> ))} </ul> </div>)}}}
  } else {
    buttons = (<div className="overview button-container">
                   <Button className="join-buttons L-inactive" onClick={() => setView("join")}> Play </Button>
                   <Button className="join-buttons R" onClick={() => setView("spectate")}> Spectate </Button>
               </div>);
    if (lobbies) {
        if (!lobbiesToSpectate(lobbies)) {
            content = <Spinner/>;
            noGames = 'No ongoing games found. Start your own by clicking on "New Game"!';
            }
        else {
            noGames = "";
            if (!game) {
                content = (
                  <div className="overview view-description">
                  <p className="overview paragraph"> Currently ongoing games: <hr/></p>
                    <ul className="overview lobby-list">
                      {lobbies.map(lobby => (
                        canBeSpectated(lobby) && <Button className="overview lobby-button"
                            onClick={() => spectateLobby({lobby})}>
                          <Lobby lobby={lobby} key={lobby.id}/> </Button> ))} </ul> </div>)}}}
  }

  if (user) {
      userName = user.username;
      contentProfilePicture = (<img src={buildGetRequestExternalAPI(user.id)} width={50} length={50}/>);
   }

    return (
        <BaseContainer className="overview container">
        <div className="overview content">
        <div className="overview welcome-container">
          <h2>Welcome, <span className="lobbies username">{userName}</span>!</h2>
            <div className="overview welcome-image"> {contentProfilePicture}</div>
          <Button className="overview newgame-button" width="100%"
              onClick={() => newGame()}>
              New Game
            </Button>
          </div>
          {buttons}
          <div className="overview lobby-container">
          {content}
          {noGames}
          </div>
          <hr width="80%"/>
          <div className="overview button-container">
              <Button className="blue-button margin" width="50%" onClick={() => logout()}>
                Logout
              </Button>
              <Button width="50%" onClick={() => userList()}>
                Users
              </Button>
          </div></div>
        </BaseContainer>
      );
    }

export default LobbyOverview;
