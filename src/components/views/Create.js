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
  <div className="settings row">
    <label className="settings option">
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
        const requestBody = JSON.stringify({host_id, name, is_public, total_players, timer});
        const response = await api.post('/lobbies', requestBody);
        let lobbyId = response.data.id;
        localStorage.setItem('lobby', lobbyId);
        history.push('/lobby');
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

  function PlayersButton(props){
    let selected = "inactive";
    if (total_players == props.amount) selected = "buttons";
    let position = "M";
    if (props.position == "L") position = "L";
    else if (props.position == "R") position = "R";
    return (<Button className={"rules-"+ selected +" "+position} onClick={() => setTotal_players(props.amount)}> {props.amount} </Button>)
  }
  function PrivacyButton(props){
      let selected = "inactive";
      let state = true;
      if (props.state == "private") state = false;
      if (is_public == state) selected = "buttons";
      let position = "R";
      if (props.position == "L") position = "L";
      return (<Button width="100px" className={"rules-"+ selected +" "+position} onClick={() => setIs_public(state)}> {props.state} </Button>)
    }
  function TimerButton(props){
    let selected = "inactive";
    if (timer == props.time) selected = "buttons";
    let text = props.time;
    if (props.time == 0) text = "x";
    let position = "M";
    if (props.position == "L") position = "L";
    else if (props.position == "R") position = "R";
    return (<Button className={"rules-"+ selected +" "+position} onClick={() => setTimer(props.time)}> {text} </Button>)
  }

  let settings = <Spinner/>;
  if (host_id) {
    settings = (
      <div className="settings container">
      <div className="settings form">
        <FormField
          label="Name: "
          placeholder="New Game"
          value={name}
          onChange={ln => setName(ln)} />
        <div className="settings row"> <div className="settings option">Players:</div>
        <PlayersButton amount={2} position="L"/>
        <PlayersButton amount={3}/>
        <PlayersButton amount={4} position="R"/></div>

        <div className="settings row"> <div className="settings option">Timer:</div>
        <TimerButton time={0} position="L"/>
        <TimerButton time={30}/>
        <TimerButton time={45}/>
        <TimerButton time={60} position="R"/></div>

        <div className="settings row"> <div className="settings option">Type:</div>
        <PrivacyButton state={"public"} position="L"/>
        <PrivacyButton state={"private"}/> </div>
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