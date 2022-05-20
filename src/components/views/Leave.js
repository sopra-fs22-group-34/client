import * as React from "react";
import BaseContainer from "components/ui/BaseContainer";
import {useState} from 'react';
import "styles/views/Rules.scss";
import {Button} from 'components/ui/Button';
import GamePage from "./Game";

const LeavePage = props => {
    let [view, setView] = useState("leave");
    let content;
    let buttons;
    return (
        <BaseContainer className="popup-box">
            <div className="leave container">
                <Button className="blue-button" onClick={props.handleClose}> x </Button>
                content = (<div>
                    <div className="LeaveTitle">Leave</div>
                    <div className="LeaveText">Are you sure you want to leave?</div>
                </div>
                {buttons}
                {content}
            </div>
        </BaseContainer>
    );
}

export default LeavePage;
