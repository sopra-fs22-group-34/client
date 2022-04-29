import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {Spinner} from 'components/ui/Spinner';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/User.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

//prepare the GET request for a random profile picture from the external API
function buildGetRequestExternalAPI(userId, input) {
        let URL;
        if (input === undefined) {
            URL = "https://avatars.dicebear.com/api/jdenticon/" + userId + ".svg";
        } else {
            URL = "https://avatars.dicebear.com/api/jdenticon/" + userId + input + ".svg";
        }
        return URL;
}

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

const UserPage = props => {
  const history = useHistory();
  const [user, setUser] = useState(null);

  useEffect(() => {
      async function fetchData() {
        try {
          const currentPage = await api.get(window.location.pathname);
          setUser(currentPage.data);
          console.log(currentPage.data);
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

  let srcProfilePicture = buildGetRequestExternalAPI(localStorage.getItem("id"));

  let content = <Spinner/>
  let editButton = null;
  if (user) {
    content = (
        <div className="profile container">
          <div className="profile name-container">
            <img src={srcProfilePicture}/>
            <div className="profile username">{user.username}</div>
            <div className="profile logged_in">{logged_inToString(user.logged_in)}</div>
          </div>
          <hr/>
          <div className="profile stats">Joined: {displayDate(user.creation_date)}</div>
          <div className="profile stats">Birthday: {displayDate(user.birthday)}</div>
        </div>
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
         <Button className="user return-button"
           width="100%"
           onClick={() => returnGame()}>
           &#60; Return
         </Button>
      </div>
    <div className="profile outer-container">
     {content}

     {editButton}
    </div>
    </div>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export {UserPage, buildGetRequestExternalAPI};