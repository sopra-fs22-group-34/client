import * as React from "react";
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Rules.scss";
import {Button} from 'components/ui/Button';

const RulesPage = () => {
    const history = useHistory();


    return (
        <BaseContainer className="rules container">
            <div className="rules header">Game Rules of Azul</div>
                <div className="rules title">Object of the game:</div>
                <div className="rules text">
                To be the player with the
                most points at the end of the game. The game ends after
                the round in which at least one player has completed a horizontal
                line of 5 consecutive tiles on her wall. [PICTURE OF HORIZONTAL LINE]
                </div>
            <div className="rules title">Gameplay</div>
            <div className="rules text">
                The game is played over two phases:
                <ol>
                    <li className="rules list-item">Factory offer</li>
                    <div className="rules text">
                        On your turn you MUST pick tiles in one of the following ways:
                        Either a)
                        pick all tiles of the same color from any one Factory display.
                        The remaining tiles get moved to the middle (the field below the Factories).
                        Or b)
                        pick all the tiles of the same color from below the factories - the middle.
                        If you are the first one to pick tiles from the middle you get a minus point.
                        <p>
                        Then, add the chosen tiles to one of the 5 pattern lines on your player board. [PICTURE OF PATTERN LINES]
                        The first line has 1 space to hold 1 tile, the fifth line has 5.</p>
                        <p>
                        If your pattern line already holds tiles, you can only add tiles of the same color to it.
                        Once all spaces of a pattern line are filled, that line is considered complete. </p>
                        <p> If you have picked up more tiles than you can place on in your chosen pattern line,
                            the excess tiles get placed in the floor line (see Floor Line). </p>

                        [IN ITALIC] Your goal in this phase is to complete as many pattern lines as you can, because during
                        the following Wall-tiling phase, you will only be able to move tiles from completed pattern lines
                        to their corresponding lines on your wall to score points.
                        In all later rounds, you must comply with the following rule: You are NOT ALLOWED to place tiles of a
                        certain color in a pattern line whose corresponding line of your wall already holds a tile of that color.

                        This phase ends when the middle AND all Factory displays contain no more tiles.
                    </div>
                    <div className="rules subtitle">Floor line</div>
                    <div className="rules text">
                        Any tiles you have picked that you cannot or do not want to place according to the rulesm you must place
                        in your floor line, filling its spaces from left to right. These tiles give minus points in the Wall-tiling
                        phase.
                    </div>
                    <li className="rules list-item">Wall-tiling</li>
                    <div className="rules text">
                        This phase will be carried out for you by the AI, as it moves tiles from your completed pattern lines
                        over to their place on the wall.
                        Once that is done, any remaining tiles on the pattern lines stay on your player board for the next round.
                    </div>
                </ol>
                <div className="rules title">Scoring</div>
                <div className="rules text">
                    Each tile you move over to your wall is always placed on the space matching its color and immediately
                    scores as follows:
                    <ul>
                        <li>
                            If there are no tiles directly adjacent (vertically or horizontally) to the newly placed tile,
                            you gain 1 point.
                        </li>
                        <li>
                            If there are any tiles adjacent, however, all the horizontally and vertically linked tiles
                            gain you 1 point. [INCLUDE PICTURE AS EXAMPLE]
                        </li>
                    </ul>
                    Additionally you gain points for:
                    <ul>
                        <li> 2 points for each complete horizontal line of 5 consecutive tiles on your wall. (ends the game) [IS THIS TRUE??]</li>
                        <li> 2 points for each complete vertical line of 5 consecutive tiles on your wall. </li>
                        <li> 10 points for each color of which you have placed all 5 tiles on your wall. [IS THIS IMPLEMENTED YET?!] </li>
                    </ul>
                    Finally if there are any tiles in your floor line, you lose the number of points indicated directly
                    above it. Your score will get adjusted accordingly (however, you can never drop below 0 points.)
                    Note: If you have the "1" tile in your floor line, it counts as a normal tile.
                </div>
                <div className="rules title">End of the game</div>
                <div className="rules text">
                    The game ends right after the Wall-tiling phase in which at least one player has completed at least one
                    horizontal line of 5 consecutive tiles on her wall.
                </div>
            </div>
            <Button className="blue-button"
                width="100%"
                onClick={() => history.goBack()}
            >
                Back
            </Button>
        </BaseContainer>
    );

}

export default RulesPage;
