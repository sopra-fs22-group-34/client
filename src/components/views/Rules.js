import * as React from "react";
import BaseContainer from "components/ui/BaseContainer";
import {useState} from 'react';
import "styles/views/Rules.scss";
import {Button} from 'components/ui/Button';

import color from '../../assets/color.png'
import connect from '../../assets/connect.png'
import factory from '../../assets/factory.png'
import horizontal from '../../assets/horizontal.png'
import middle from '../../assets/middle.png'
import single from '../../assets/single.png'
import vertical from '../../assets/vertical.png'
import valid from '../../assets/valid.png'
import invalid from '../../assets/invalid.png'

const RulesPage = props => {
    let [view, setView] = useState("gameplay");
    let content;
    let buttons;

    function MainPointsExample(props){
        return (
            <div className="example big-container">
                <div className="example points"> {props.points} Point</div>
                <div className="example text"> {props.text} </div>
                <img alt="image" width="100%" src={props.image}/>
            </div>
        );
    }
    function PointsExample(props){
        return (
            <div className="example container">
                <div className="example points"> +{props.points} Points</div>
                <div className="example text"> {props.text} </div>
                <img alt="image" width="100%" src={props.image}/>
            </div>
        );
    }

    function ImageExample(props){
        return (
            <div className="example img-container">
                <div className="example points"> {props.thing}</div>
                <div className="example text"> <i>{props.text}</i> </div>
                <img alt="image" height="60%" src={props.image}/>
            </div>
        );
    }

    function WideImageExample(props){
        return (
            <div className="example img-container">
                <div className="example points"> {props.thing}</div>
                <div className="example text"> <i>{props.text}</i> </div>
                <img alt="image" width="100%" src={props.image}/>
            </div>
        );
    }

    function MoveExample(props){
        return (
            <div className="example img-container">
                <div className="example points"> {props.thing}</div>
                <div className="example text"> <i>{props.text}</i> </div>
                <img alt="image" height="40%" src={props.image}/>
            </div>
        );
    }
    function InfoBox(props){
        return (
            <div className="example info-container">
                <div className="example points"> {props.thing}</div>
                <div className="example text"> {props.text} </div>
            </div>
        );
    }

    if (view === "gameplay") {
        buttons = (<div className="rules buttons-container">
                       <Button className="rules-buttons L" onClick={() => setView("gameplay")}> Gameplay </Button>
                       <Button className="rules-inactive R" onClick={() => setView("scoring")}> Scoring </Button>
                   </div>);
        content = (<div>
            <div className="rules title"><b>Step 1: </b>pick up all tiles of the same color from...</div>
            <div className="example list">
                <ImageExample thing={"a Factory"} text={"Remaining tiles are moved to the middle."} image={factory}/>
                <WideImageExample thing={"the Middle"} text={"The first player to pick tiles from the middle gets the -1 tile, but will start the next round."} image={middle} />
            </div>
            <div className="rules title"><b>Step 2: </b>place the chosen tiles one one of your pattern lines</div>
            <div className="example list">
                <MoveExample thing={"Valid Target"} text={"An empty pattern line, or one with tiles of the same color.*"} image={valid}/>
                <MoveExample thing={"Invalid Target"} text={"A pattern line with tiles of a different color, or one that was previously completed."} image={invalid} />
            </div>
            <div className="rules title">
                *Excess tiles, or any other tiles you cannot place according to the rules must be placed
                on your floor line. These tiles will give you negative points.
            </div>
            </div>
        );
    } else {
        buttons = (<div className="rules buttons-container">
                       <Button className="rules-inactive L" onClick={() => setView("gameplay")}> Gameplay </Button>
                       <Button className="rules-buttons R" onClick={() => setView("scoring")}> Scoring </Button>
                   </div>);
        content = (<div>
            <div className="rules text">
                <div className="rules title">Tiles from completed pattern lines are moved to the wall and earn points:</div>
                <div className="example list">
                    <MainPointsExample points={1} text={"single tile"} image={single}/>
                    <MainPointsExample points={"+1"} text={"each adjacent tile"} image={connect} />
                </div>
                <div className="example list">
                    <PointsExample points={2} text={"horizontal line"} image={horizontal}/>
                    <PointsExample points={7} text={"vertical line"} image={vertical} />
                    <PointsExample points={10} text={"all tiles of color"} image={color} />
                </div>
                <div className="rules title">For each tile in your floor line, you lose the number of points written next to it.<br/>
                (You can never drop below 0 points.)</div>
            </div>
        </div>
        )
    }
    return (
        <BaseContainer className="popup-box">
            <div className="rules container">
                <Button className="blue-button" onClick={props.handleClose}> x </Button>
                <div className="example list">
                    <InfoBox thing="Goal" text="Complete as many pattern lines as you can!"/>
                    <InfoBox thing="Complete" text="If a pattern line is full, that line is considered complete. (Incomplete pattern lines carry over to the next round.)"/>
                    <InfoBox thing="Round" text="A round ends when the middle and all factories are empty."/>
                    <InfoBox thing="Game End" text="The game ends once at least one player has a horizontal line on their wall."/>
                </div>
                {buttons}
                {content}
            </div>
        </BaseContainer>
    );

}

export default RulesPage;
