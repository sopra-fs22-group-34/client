import React, {useState} from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Button} from 'components/ui/Button';
import Rules from "components/views/Rules";

const Header = props => {
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => {setIsOpen(!isOpen);}
    return (
            <div className="header container" style={{height: props.height}}>
                <div>
                    <Button className="account-button"
                        onClick={() => window.location.href = "/users/edit/" + localStorage.getItem('id')}> Settings </Button>
                    <Button className="rules-button" onClick={togglePopup}> Game Rules </Button>
                </div>
                {isOpen && <Rules
                    content={<>
                    </>}
                    handleClose={togglePopup}
                />}
            </div>
    );
    Header.propTypes = {
        height: PropTypes.string
    }

//<h1 className="header title">SoPra FS22 - Group 34</h1>
//<ReactLogo width="60px" height="60px"/>
}

export default Header;
