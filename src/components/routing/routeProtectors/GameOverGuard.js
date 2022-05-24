import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const GameOverGuard = props => {
  if (!localStorage.getItem('game') && localStorage.getItem("token") && localStorage.getItem("lobby")){
    return <Redirect to="/lobby"/>;
  } else if (localStorage.getItem("token") && localStorage.getItem('game') && !localStorage.getItem("lobby")) {
    return props.children;
  } else if (localStorage.getItem("token") && localStorage.getItem('game') && localStorage.getItem("lobby")) {
    return <Redirect to="/game"/>;
  } else if (localStorage.getItem("token")){
    return <Redirect to="/home"/>;
  }
  return <Redirect to="/login"/>;
};

GameOverGuard.propTypes = {
  children: PropTypes.node
};