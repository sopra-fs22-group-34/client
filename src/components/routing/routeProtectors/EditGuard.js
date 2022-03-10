import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

/**
 *
 * Another way to export directly your functional component.
 */
export const EditGuard = props => {
  if (localStorage.getItem("token") && localStorage.getItem('id') == window.location.pathname.substring(12)) {
    return props.children;
  } else if (localStorage.getItem("token")){
    return <Redirect to={window.location.pathname.substring(0,7)+window.location.pathname.substring(12)}/>;
  }
  return <Redirect to="/login"/>;
};

EditGuard.propTypes = {
  children: PropTypes.node
}