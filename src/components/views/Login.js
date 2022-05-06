import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
  return (
    <div className="login field">
      {props.label}
      <input
        className="login input"
        placeholder={props.label}
        value={props.value} maxlength="15"
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const Login = () => {
  const history = useHistory();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const doLogin = async (login) => {
    try {
      const requestBody = JSON.stringify({username, password});
      let response;

      // If logging in, log in, else register new user
      if (login) response = await api.post('/users/'+username, requestBody);
      else response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('id', user.id);

      // Restore the lobby the user was in before logging out, if there is one
      let inAnyLobby = await api.get('/users/' + localStorage.getItem('id') + '/lobbies/');
      if (inAnyLobby.data != null) { localStorage.setItem('lobby', inAnyLobby.data.id); }

      // Login successfully worked --> navigate to the route /home in the GameRouter
      history.push(`/home`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  }

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <div className="login title">
            Welcome!
          </div>
          <FormField
            label="Username"
            value={username}
            onChange={un => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={p => setPassword(p)}
          />
          <div className="login button-container">
            <Button className="blue-button margin"
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin(false)} >
              Register
            </Button>
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin(true)} >
              Login
            </Button>
            </div>

        </div>
      </div>
    </BaseContainer>
  );
};
// <p>Not a member yet? Register <a href="/register">here</a>!</p>
/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
