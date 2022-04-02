import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Overview.scss";

const Lobby = ({lobby}) => (
  <div className="lobby container">
    <div className="lobby hostname">{lobby.hostname}</div>
    <div className="lobby lobbyname">{lobby.lobbyname}</div>
    <div className="lobby players">{lobby.players}/{lobby.total_players}</div>
  </div>
);

Lobby.propTypes = {
  lobby: PropTypes.object
};

const Overview = () => {
  const history = useHistory();
  const [lobbies, setLobbies] = useState(null);

  const goToLobby = ({lobby}) => {
      history.push('/lobbies/'+lobby.id);
  }
  useEffect(() => {
      async function fetchData() {
        try {
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

  let content = <Spinner/>;
  const userName = "Player";

  if (lobbies) {
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
      </div>
    )
    }

    return (
        <BaseContainer className="overview container">
          <h2>Welcome, {userName}!</h2>
          <p className="overview paragraph">
            Games looking for players:
          </p>
          {content}
          <Button width="100%"
            onClick={() => logout()}>
            Logout
          </Button>
        </BaseContainer>
      );
    }

    export default Game;

}