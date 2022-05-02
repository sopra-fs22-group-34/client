import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/UserList.scss";

const Player = ({user}, {online_status=logged_inToString(user.logged_in)}) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    <div className="player logged_in">{online_status}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
  online_status: PropTypes.string
};

// if logged_in is true, display the user to be "ONLINE", otherwise "OFFLINE"
function logged_inToString(bool){
    if (bool) { return "ONLINE"; }
    return "OFFLINE";
}

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

  const logout = () => {
    try { api.put('/users/'+localStorage.getItem("id")+"/logout");
    } catch (error) { alert(`Something went wrong during the logout: \n${handleError(error)}`);}

    localStorage.removeItem('token');
    localStorage.removeItem('id');
    history.push('/login');
  }

  const userPage = ({user}) => {
    history.push('/users/'+user.id);
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
      <h2>Welcome, {userName}!</h2>
      <p className="userlist paragraph">
        Registered users:
      </p>
      {content}
      <Button
        width="100%"
        onClick={() => logout()}>
        Logout
      </Button>
    </BaseContainer>
  );
}

export default UserList;
