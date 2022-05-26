import * as React from "react";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Confirm.scss";
import {Button} from 'components/ui/Button';
import {Leave} from "./Game";
import {StopSpectating} from "./Game";
import {QuitGame} from "./Game";


const ConfirmPage = props => {
    let buttons;
    let message;
    if (props.text) message = props.message;
    else message = "Are you sure you want to leave?";

    if (props.type == "confirm") {
        buttons = (<div className="confirm buttons-container">
                    <Button width="50%" className="orange-button" onClick={props.handleConfirm}> Okay </Button>
                </div>)
    } else {
        buttons = (<div className="confirm buttons-container">
                    <Button width="50%" className="blue-button margin" onClick={props.handleConfirm}> Yes </Button>
                    <Button width="50%" className="orange-button" onClick={props.handleClose}> No </Button>
                </div>)
    }

    return (
        <div className="confirm background">
        <div className="popup-box">
            <div className="confirm container">
                <div className="confirm text">
                    <div className="confirm title">{message}</div> </div>
                {buttons}
            </div>
        </div>
        </div>
    );

}

export default ConfirmPage;