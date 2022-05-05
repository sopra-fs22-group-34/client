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
      value={props.value} maxlength="15"
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
  const [host_id, setHost_id] = useState(localStorage.getItem("id"));
  const [name, setName] = useState("New Game");
  const [total_players, setTotal_players] = useState(4);
  const [is_public, setIs_public] = useState(true);
  const [timer, setTimer] = useState(45);

  const Return = () => {
    history.push('/home');
    };

  const Open = async () => {
    try {
        const requestBody = JSON.stringify({host_id, name, is_public, total_players});
        const response = await api.post('/lobbies', requestBody);
        let lobbyId = response.data.id;
        localStorage.setItem('lobby', lobbyId);
        history.push("/lobbies/"+lobbyId);
    } catch (error) { alert(`Something went wrong while creating the lobby: \n${handleError(error)}`);
        history.push('/home');}
    };

  useEffect(() => {
      async function fetchData() {
        try {
          setHost_id(localStorage.getItem("id"));
          setIs_public(true);
          setName("New Game");
          setTotal_players(4);
          setTimer(45);
        } catch (error) {
          console.error(`Something went wrong while fetching your username: \n${handleError(error)}`);
          console.error("Details:", error);
          alert("Something went wrong while fetching your username! See the console for details.");
        }
      }
      fetchData();
    }, []);

  let settings = <Spinner/>;
  if (host_id) {
    settings = (
      <div className="settings container">
      <div className="settings form">
        <FormField
          label="Name: "
          placeholder="New Game"
          value={name}
          onChange={ln => setName(ln)}
        />
        Players: <b>{total_players}</b>
        <Button className="settings players-button" onClick={() => setTotal_players(2)}> 2 </Button>
        <Button className="settings players-button" onClick={() => setTotal_players(3)}> 3 </Button>
        <Button className="settings players-button" onClick={() => setTotal_players(4)}> 4 </Button>
      </div>
      </div>)
    }

  return (
        <BaseContainer className="lobby container"><div className="lobby content">
        <div className="lobby buttons-container">
          <Button className="blue-button" width="30%" onClick={() => Return()}>
              &#60; Cancel
            </Button>
          </div>
          <h2>Configure Game Settings:</h2>
          {settings}
        <div className="lobby players-container">
          <Button width="100%" onClick={() => Open()}>
            Open for Players
          </Button>
        </div></div>
        </BaseContainer>
      );

}
export default CreatePage;