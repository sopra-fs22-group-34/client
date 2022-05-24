import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const HomeGuard = props => {
  if (localStorage.getItem("token")) {
    return props.children;
  }
  return <Redirect to="/login"/>;
};

HomeGuard.propTypes = {
  children: PropTypes.node
};