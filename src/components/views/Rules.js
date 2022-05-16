import * as React from "react";
import BaseContainer from "components/ui/BaseContainer";
import {useState} from 'react';
import "styles/views/Rules.scss";
import {Button} from 'components/ui/Button';

const RulesPage = props => {
    let [view, setView] = useState("gameplay");
    let content;
    let buttons;
    if (view === "gameplay") {
        buttons = (<div className="rules buttons-container">
                       <Button className="rules-buttons L" onClick={() => setView("gameplay")}> Gameplay </Button>
                       <Button className="rules-buttons R-inactive" onClick={() => setView("scoring")}> Scoring </Button>
                   </div>);
        content = (<div>
            <div className="rules title">Gameplay</div>
            <div className="rules text">
                    <div className="rules text">
                        To start, pick up all tiles of the same color from:<p>
                        a) A Factory display.
                        (The remaining tiles get moved to the middle.)</p><p>
                        b) The middle.
                        (The first player to pick tiles from the middle gets a minus point, but also gets to play first in the next round.)</p>

                        <p> Then, add the chosen tiles to one of the 5 pattern lines on your player board. [PICTURE OF PATTERN LINES] </p>
                        <p> If a pattern line already holds tiles, you can only add tiles of the same color to it.
                            Once all spaces of a pattern line are filled, that line is considered complete. </p>
                        <p> If you have picked up more tiles than you can place on your chosen pattern line,
                            the excess tiles get placed on the floor line (see Floor Line). </p>

                        <i>Your goal in this phase is to complete as many pattern lines as you can!</i>

                        <p>This phase ends when the middle and all Factory displays contain no more tiles.</p>
                    </div>
                    <div className="rules subtitle">Floor line</div>
                    <div className="rules text">
                        Any tiles you cannot or do not want to place according to the rules must be placed
                        on your floor line. These tiles give minus points in the Wall-tiling phase.
                    </div>
                </div>
            </div>
        );
    } else {
        buttons = (<div className="rules buttons-container">
                       <Button className="rules-buttons L-inactive" onClick={() => setView("gameplay")}> Gameplay </Button>
                       <Button className="rules-buttons R" onClick={() => setView("scoring")}> Scoring </Button>
                   </div>);
        content = (<div>

            <div className="rules title">Scoring</div>
            <div className="rules text">
                Any tiles from your completed pattern lines will be moved over to the wall, and you will gain points as follows:
                <ul>
                    <li>
                        If there are no tiles adjacent (vertically or horizontally) to the newly placed tile,
                        you gain 1 point.
                    </li>
                    <li>
                        If there are any adjacent tiles, all horizontally and vertically linked tiles
                        earn you 1 point each. [INCLUDE PICTURE AS EXAMPLE]
                    </li>
                </ul>
                Additionally, you gain:
                <ul>
                    <li> 2 points for each complete horizontal line of 5 consecutive tiles on your wall.</li>
                    <li> 2 points for each complete vertical line of 5 consecutive tiles on your wall. </li>
                    <li> 10 points for each color of which you have placed all 5 tiles on your wall. </li>
                </ul>
                For each tile in your floor line, you lose the number of points written next to it.
                Your score will get adjusted accordingly, but you can never drop below 0 points.
                <p> Once the points are calculated, any remaining tiles on the pattern lines stay on your player board for the next round.</p>
            </div>
            <br/>
            <div className="rules title">End of the game</div>
            <div className="rules text">
                The game ends right after the Wall-tiling phase in which at least one player has completed at least one
                horizontal line of 5 consecutive tiles on her wall.
            </div>
        </div>
        )
    }
    return (
        <BaseContainer className="popup-box">
            <div className="rules container">
                <Button className="blue-button" onClick={props.handleClose}> x </Button>
                <div className="rules header">Rules of Azul</div>
                    <div className="rules title">Game Objective:</div>
                    <div className="rules text">
                    Earn as many points as you can by decorating your wall with tiles!
                    The game ends once at least one player has completed a horizontal
                    line of 5 consecutive tiles on their wall. [PICTURE OF HORIZONTAL LINE]
                    </div>
                {buttons}
                {content}
            </div>
        </BaseContainer>
    );

}

export default RulesPage;
