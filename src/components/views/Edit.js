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
const FormField = props => {
 return (
  <div className="register field">
    <label className="register label">
      {props.label}
    </label>
    <input className="register input"
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


const EditPage = props => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [birthday, setBirthday] = useState(null);

  useEffect(() => {
      // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
      async function fetchData() {
        try {
          const currentPage = await api.get('/users/'+localStorage.getItem('id'));

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

  const saveChanges = async () => {
    try {
        const requestBody = JSON.stringify({username, birthday});
        const response = await api.put('/users/'+localStorage.getItem('id'), requestBody);

        // Update worked --> return to the user's profile
        history.push('/users/'+localStorage.getItem('id'));
    } catch (error) {
        alert(`Something went wrong while updating your profile: \n${handleError(error)}`);
    }
  }

  let content = <Spinner/>
  if (user) {
    content = (
        <div className="profile container">
        <div className="user form">
          <FormField
            label="Username"
            placeholder={user.username}
            value={username}
            onChange={un => setUsername(un)}
          />
          <FormField
            label="Birthday (Format YYYY-MM-DD)"
            placeholder={displayDate(user.birthday)}
            value={birthday}
            onChange={b => setBirthday(b)}
          />
        </div>
        </div>
    )
  }
  return (
  <BaseContainer>
    <div className="user container">
     {content}
     <div className="user edit-button-container">
        <Button
          width="100%"
          onClick={() => saveChanges()}>
          Save Changes
        </Button>
      </div>
    </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default EditPage;
