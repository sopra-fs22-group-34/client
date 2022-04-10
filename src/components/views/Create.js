import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import Lobby from 'models/Lobby';
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
  const [host_id, setHost_id] = useState(null);
  const [name, setName] = useState(null);
  const [total_players, setTotal_players] = useState(null);
  const [is_public, setIs_public] = useState(null);
  const [timer, setTimer] = useState(null);

  const Return = () => {
    history.push('/home');
    }
  const Open = () => {
    try {
        const requestBody = JSON.stringify({host_id, name, is_public, total_players});
        const response = api.post("/lobbies", requestBody);
        const lobby = new Lobby(response.data);
        localStorage.setItem('game', lobby.id);
        history.push("/lobbies/"+lobby.id);
    } catch (error) { alert(`Something went wrong while creating the lobby: \n${handleError(error)}`);
        history.push('/home');}
    }

  useEffect(() => {
      async function fetchData() {
        try {
          const response = await api.get("/users/"+localStorage.getItem("id"));
          setHost_id(response.data.id);
          setIs_public(true);
          setName("New Game");
          setTotal_players(4);
          setTimer(45);
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
        Players:
        <Button className="settings players-button" onClick={() => setTotal_players(2)}> 2 </Button>
        <Button className="settings players-button" onClick={() => setTotal_players(3)}> 3 </Button>
        <Button className="settings players-button" onClick={() => setTotal_players(4)}> 4 </Button>
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