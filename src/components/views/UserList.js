import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/UserList.scss";
import {buildGetRequestExternalAPI, loggedInToString} from "./User";

const Player = ({user}, {online_status=loggedInToString(user)}) => (
  <div className="player container">
    <img width="30px" height="30px" src={buildGetRequestExternalAPI(user.id)}/>
    <div className="player username">{user.username}</div>
    <div className="player logged_in">{online_status}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
  online_status: PropTypes.string
};

const UserList = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState(null);

  const userPage = ({user}) => {
    history.push('/users/'+user.id);
  }

  const Return = () => {
    history.push('home');
  }

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const player = await api.get('/users/'+localStorage.getItem("id"));
        setUser(player.data);
        const response = await api.get('/users');

        // Get the returned users and update the state.
        setUsers(response.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log('request to:', response.request.responseURL);
        console.log('status code:', response.status);
        console.log('status text:', response.statusText);
        console.log('requested data:', response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }

    fetchData();
  }, []);

  let content = <Spinner/>;
  let userName = "";
  if (user) {userName = user.username;}

  if (users) {
    content = (
      <div className="userlist">
        <ul className="userlist user-list">
          {users.map(user => (
            <Button className="userlist user-button" onClick={() => userPage({user})}>
              <Player user={user} key={user.id}/>
            </Button>
          ))}
        </ul>
      </div>
    )
  }


  return (
    <BaseContainer className="userlist container">
    <div className="userlist content">
      <div className="userlist button-container">
          <Button className="blue-button margin" width="50%" onClick={() => Return()} >
            &#60; Return
          </Button>
      </div>
      <p className="userlist paragraph">
        Registered users:
      </p>
      {content}
      </div>
    </BaseContainer>
  );
}

export default UserList;
