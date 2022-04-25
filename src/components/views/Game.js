import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

const Game  = props => {
    const history = useHistory();
    const [view, setView] = useState(localStorage.getItem('id'));
    const [game, setGame] = useState(null);

    useEffect(() => {
        < async function fetchData() {
            try {
                const currentGame = await api.get("/users/"+localStorage.getItem("id")+"/game");
                setGame(currentGame.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the game data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the game data! See the console for details.");
            }
        }
        fetchData();
    }, []);>

    let content = null;
    if (game) {
        content = ();
    }

    return (
        <div className="game container">
            <div className="game field">
                <div className="game turn-container"> </div>
                <div className="game middle-container">
                    <div className="game tiles-container"> </div>
                    <div className="game factory-container"> </div>
                </div>
            </div>
            <div className="game board">
                <div className="game floorline-container"> </div>
                <div className="game stairs"> </div>
                <div className="game wall"> </div>
            </div>
        </div>
    );

}

export default Game;