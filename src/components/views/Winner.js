import * as React from "react";
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Winner.scss";
import {Button} from 'components/ui/Button';
import ReactConfetti from "react-confetti";
import useWindowSize from 'react-use/lib/useWindowSize'
import {api, handleError} from "../../helpers/api";
import {useEffect, useState} from "react";


const WinnerPage = () => {
    const history = useHistory();
    const { width, height } = useWindowSize();
    let [player1, setPlayer1] = useState(null);
    let [player2, setPlayer2] = useState(null);
    let [player3, setPlayer3] = useState(null);
    let [player4, setPlayer4] = useState(null);
    let [scorePlayer1, setScorePlayer1] = useState(null);
    let [scorePlayer2, setScorePlayer2] = useState(null);
    let [scorePlayer3, setScorePlayer3] = useState(null);
    let [scorePlayer4, setScorePlayer4] = useState(null);
    let lobbyData;
    let players;

    //own functional component, such that a winner can get displayed on steps
    function Step(props) {
        return (<div className="winner podium-step">{props.data}</div>)
    }

    useEffect(() => {
        async function fetchUsers() {
            try {
                let currentGame = await api.get("/lobbies/" + localStorage.getItem('lobby') + "/game");
                let game = currentGame.data;
                console.log(game);
                lobbyData = game.lobbyData;
                players = game.players;
                console.log(players);
                console.log(lobbyData.players[0].id);
                console.log(lobbyData.players[1].name);

                //tried to include the scores too, but something did not work out...
                setPlayer1(lobbyData.players[0].name + ": ");
                //let stepPlayer1 = <Step props = {player1}/>
                setScorePlayer1(players[0].score);

                setPlayer2(lobbyData.players[1].name + ": ");
                setScorePlayer2(players[1].score);

                if (lobbyData.current_players > 2) {
                    setPlayer3(lobbyData.players[2].name + ": ");
                    setScorePlayer3(players[2].score);
                }
                if (lobbyData.current_players > 3) {
                    setPlayer4(lobbyData.players[3].name + ": ");
                    setScorePlayer4(players[3].score);
                }
                console.log(players[0].score);

                // TODO: causes errors for now. get and delete should only be done once
                await new Promise(resolve => setTimeout(resolve, 3000));
                await api.delete("/lobbies/" + localStorage.getItem('lobby'));

            } catch (error) {
                console.error(`Something went wrong while fetching the game data: \n${handleError(error)}`);
                console.error("Details:", error);
            }
        }

        fetchUsers();

    },[]);

    return (

        <BaseContainer className="winner container">
            <Button className="blue-button margin" width="50%" onClick={() => history.push('home')} >
                &#60; Return
            </Button>
            <div className="winner header">
                GAME OVER
            </div>
            <div className="winner title">Thank you for playing Azul!</div>
            <div className="winner player-names">Scoreboard</div>
            <div className="winner player-names">
                {player1} {scorePlayer1}<br/>
            </div>
            <div className="winner player-names">
                {player2} {scorePlayer2}<br/>
            </div>
            <div className="winner player-names">
                {player3} {scorePlayer3} <br/>
            </div>
            <div className="winner player-names">
                {player4} {scorePlayer4} <br/>
            </div>
            <div>
                <Step/>
            </div>
            <div className="winner podium-step">
            </div>
            <div>
                <ReactConfetti
                    width={width}
                    height={height}
            />
            </div>
        </BaseContainer>
    );

}

export default WinnerPage;
