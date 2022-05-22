import * as React from "react";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Confirm.scss";
import {Button} from 'components/ui/Button';
import {Leave} from "./Game";
import {StopSpectating} from "./Game";
import {QuitGame} from "./Game";


const ConfirmPage = props => {
    let content;
    let buttons;

    buttons = (<div>
        <div className="leave buttons-container">
            <Button className="leave-buttons L" onClick={props.handleClose}> No </Button>
            <Button className="leave-inactive R" onClick={props.handleConfirm}> Yes </Button>
        </div>
    </div>
    )
    content = (<div>
            <div className="confirm text">
                <div className="confirm title">Are you sure you want to leave?</div>
            </div>
        </div>
    )

    return (
        <BaseContainer className="popup-box">
            <div className="confirm container">
                <div className="confirm exit">
                    <Button className="blue-button" onClick={props.handleClose}> x </Button></div>
                {content}
                {buttons}
            </div>
        </BaseContainer>
    );

}

export default ConfirmPage;