import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {Spinner} from 'components/ui/Spinner';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/User.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const ProfilePage = ({user}) => (
    <div className="profile container">
      <div className="profile name-container">
        <div className="profile username">{user.username}</div>
        <div className="profile logged_in">{logged_inToString(user.logged_in)}</div>
      </div>
      <hr/>
      <div className="profile creation_date">Joined: {displayDate(user.creation_date)}</div>
      <div className="profile birthday">Birthday: {displayDate(user.birthday)}</div>
    </div>
);

function logged_inToString(bool){
    if (bool) { return "ONLINE"; }
    return "OFFLINE";
}
function displayDate(date){
    if (date) {
        //let day = date.substring(8,10);
        //let mon = date.substring(5,7);
        //let year = date.substring(0,4);
        //return day + " " + mon + " " + year;
        return date.substring(0,10);
    }
    return "N/A";
}

ProfilePage.propTypes = {
    user: PropTypes.object,
    //creation_date: PropTypes.string
    //onChange: PropTypes.func
};

const UserPage = props => {
  const history = useHistory();
  const [user, setUser] = useState(null);

  useEffect(() => {
      // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
      async function fetchData() {
        try {
          const currentPage = await api.get(window.location.pathname);

          // Get the returned users and update the state.
          setUser(currentPage.data);

          // See here to get more data.
          console.log(currentPage);
        } catch (error) {
          console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
          console.error("Details:", error);
          alert("Something went wrong while fetching the user! See the console for details.");
        }
      }
      fetchData();
    }, []);

  const returnGame = async () => {
    history.push('/game');
  }

  const editUser = async () => {
    history.push('/users/edit/'+localStorage.getItem('id'));
  }

  let content = <Spinner/>
  let editButton = null;
  if (user) {
    content = (
        <ProfilePage user={user}/>
    )
  }
  if (user && localStorage.getItem('id') == user.id){
    editButton = (
      <div className="user edit-button-container">
        <Button
          width="100%"
          onClick={() => editUser()}>
          Edit Profile
        </Button>
      </div>
    )
  }
  return (
    <div className="user container">
      <div className="user button-container">
         <Button
           width="100%"
           onClick={() => returnGame()}>
           Return
         </Button>
      </div>
     {content}
     {editButton}
    </div>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default UserPage;
