import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

/**
 *
 * Another way to export directly your functional component.
 */
export const LobbyGuard = props => {
  if (localStorage.getItem("token") && localStorage.getItem("game")){
    return <Redirect to="/game"/>;
  } else if (localStorage.getItem("token") && localStorage.getItem('lobby')) {
    return props.children;
  } else if (localStorage.getItem("token")){
    return <Redirect to="/home"/>;
  }
  return <Redirect to="/login"/>;
};

LobbyGuard.propTypes = {
  children: PropTypes.node
}