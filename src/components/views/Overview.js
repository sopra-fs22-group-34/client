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

  function Lobby({lobby}){
    if (!lobby.is_open) return null;
    return (
    <div className="lobbies container">
      <div className="lobbies username">{lobby.host_name}</div>
      <div className="lobbies lobbyname">{lobby.name}</div>
      <div className="lobbies players">{lobby.current_players}/{lobby.total_players}</div>
      <div className="lobbies join-button"> Join &#62; </div>
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

  if (user) {
      userName = user.username;
      contentProfilePicture = (<img src={buildGetRequestExternalAPI(user.id)} width={50} length={50}/>);
   }
  if (lobbies) {
    if (game) {
        content = (<p>You are currently in a game! Return to it <a href="/game"> here</a>!</p>);
    } else {
        //TODO: instead of checking for lengths, do a for loop and check if any are open
        if (lobbies.length === 0) {noGames = 'No open games found. Start your own by clicking on "New Game"!';}
        else {
            noGames = "";
            if (!game) {
                content = (
                  <div className="overview">
                  <p className="overview paragraph"> Games looking for players: </p>
                    <ul className="overview lobby-list">
                      {lobbies.map(lobby => (
                        <Button className="overview lobby-button"
                            onClick={() => goToLobby({lobby})}>
                          <Lobby lobby={lobby} key={lobby.id}/>
                        </Button>
                      ))}
                    </ul>
                  </div>)}}}
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
