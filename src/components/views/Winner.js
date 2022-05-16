import * as React from "react";
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Winner.scss";
import {Button} from 'components/ui/Button';
import ReactConfetti from "react-confetti";
import useWindowSize from 'react-use/lib/useWindowSize'
import {api, handleError} from "../../helpers/api";
import {useState} from "react";


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

    async function fetchUsers() {
        try {
            let currentGame = await api.get("/lobbies/"+localStorage.getItem('lobby')+"/game");
            let game = currentGame.data;
            console.log(game);
            lobbyData = game.lobbyData;
            players = game.players;
            console.log(players);
            console.log(lobbyData.nameTwo);
            console.log(lobbyData.nameThree);

            //tried to include the scores too, but something did not work out...
            if (lobbyData.nameOne) {
                setPlayer1(lobbyData.nameOne + ": ");
                //let stepPlayer1 = <Step props = {player1}/>
                setScorePlayer1(players[0].score);
            }
            if (lobbyData.nameTwo) {
                setPlayer2(lobbyData.nameTwo + ": ");
                setScorePlayer2(players[1].score);
            }
            if (lobbyData.nameThree) {
                setPlayer3(lobbyData.nameThree + ": ");
                setScorePlayer3(players[2].score);
            }
            if (lobbyData.nameFour) {
                setPlayer4(lobbyData.nameFour + ": ");
                setScorePlayer4(players[3].score);
            }
            console.log(players[0].score);

        } catch (error) {
            console.error(`Something went wrong while fetching the game data: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the game data! See the console for details.");
        }
    }

    fetchUsers();

    return (

        <BaseContainer className="winner container">
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
