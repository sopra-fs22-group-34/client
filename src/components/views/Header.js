import React, {useState} from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Button} from 'components/ui/Button';
import Rules from "components/views/Rules";

const Header = props => {
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => {setIsOpen(!isOpen);}
    return (
            <div>
            <div className="popup-box">{isOpen && <Rules content={<> </>} handleClose={togglePopup} />}</div>
            <div className="header container" style={{height: props.height}}>
            <Button className="rules-button" onClick={togglePopup}> Game Rules </Button>
            </div>

            </div>
    );
}

export default Header;
