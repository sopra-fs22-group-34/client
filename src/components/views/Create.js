import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
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

const CreatePage = () => {
  const history = useHistory();
  const [host, setHost] = useState(null);
  const [lobbyName, setLobbyName] = useState(null);
  const [playerCount, setPlayerCount] = useState(null);
  const [timer, setTimer] = useState(null);

  const Return = () => {
    history.push('/home');
    }
  const Open = () => {
    try { const response = api.post("/lobbies");
        history.push("/lobbies/"+response.id);
    } catch (error) { alert(`Something went wrong while creating the lobby: \n${handleError(error)}`);
        history.push('/home');}
    }

  useEffect(() => {
      async function fetchData() {
        try {
          const response = await api.get("/users/"+localStorage.getItem("id"));
          setHost(response.data);
          console.log(response);
        } catch (error) {
          console.error(`Something went wrong while fetching your username: \n${handleError(error)}`);
          console.error("Details:", error);
          alert("Something went wrong while fetching your username! See the console for details.");
        }
      }
      fetchData();
    }, []);

  let settings = <Spinner/>
  if (host) {
    settings = (
      <div className="settings container">
      <div className="settings form">
        <FormField
          label="Name: "
          placeholder="New Game"
          value={lobbyName}
          onChange={ln => setLobbyName(ln)}
        />
        Players:
        <Button className="settings players-button" onClick={() => setPlayerCount(2)}> 2 </Button>
        <Button className="settings players-button" onClick={() => setPlayerCount(3)}> 3 </Button>
        <Button className="settings players-button" onClick={() => setPlayerCount(4)}> 4 </Button>
      </div>
      </div>)
    }

  return (
        <BaseContainer className="lobby container">
        <div className="lobby buttons-container">
          <Button onClick={() => Return()}>
              &#60; Cancel
            </Button>
          </div>
          {settings}
        <div className="lobby players-container">
          <Button width="100%" onClick={() => Open()}>
            Open for Players
          </Button>
        </div>
        </BaseContainer>
      );

}
export default CreatePage;