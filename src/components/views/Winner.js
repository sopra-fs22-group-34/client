import * as React from "react";
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Winner.scss";
import {Button} from 'components/ui/Button';
import ReactConfetti from "react-confetti";
import useWindowSize from 'react-use/lib/useWindowSize'
import {api, handleError} from "../../helpers/api";
import {useEffect, useState} from "react";
import {buildGetRequestExternalAPI} from "./User";


const WinnerPage = () => {
    const history = useHistory();
    const { width, height } = useWindowSize();
    let [scorePlayer1, setScorePlayer1] = useState(null);
    let [scorePlayer2, setScorePlayer2] = useState(null);
    let [scorePlayer3, setScorePlayer3] = useState(null);
    let [scorePlayer4, setScorePlayer4] = useState(null);
    let [game, setGame] = useState(true);

    function PlayerScore(props){
        if (props.score == null) return null;
        let scoreHeight = 150 + (3 * props.score);
        let boxColor = "winner-box";
        let nameColor = "winner name";
        if (game.activePlayers[props.index] == "x") {
            boxColor = "winner-box left";
            nameColor = "winner name-left";
        }

        return (
            <div className="winner player">
            <Button className={boxColor} height={scoreHeight}>
                <div className="winner score"> {game.players[props.index].score} </div>
            </Button>
            <div className="winner name-box">
            <img width="35px" height="35px" src={buildGetRequestExternalAPI(game.lobbyData.players[props.index].id)}/>
            <div className={nameColor}> {game.lobbyData.players[props.index].name} </div>
            </div></div>
        );
    }

    useEffect(() => {
        async function fetchUsers() {
            try {
                let currentGame = await api.get("/lobbies/" + localStorage.getItem('game') + "/game");
                game = currentGame.data;
                setGame(game);
                console.log(game);
                let lobbyData = game.lobbyData;
                let players = game.players;
                console.log(game);

                setScorePlayer1(players[0].score);

                setScorePlayer2(players[1].score);

                if (lobbyData.current_players > 2) {
                    setScorePlayer3(players[2].score);
                }
                if (lobbyData.current_players > 3) {
                    setScorePlayer4(players[3].score);
                }

                // TODO: causes errors for now. get and delete should only be done once
                await new Promise(resolve => setTimeout(resolve, 3000));
                await api.delete("/lobbies/" + localStorage.getItem('game'));
                localStorage.removeItem('game');
            } catch (error) {
                console.error(`Something went wrong while fetching the game data: \n${handleError(error)}`);
                console.error("Details:", error);
            }
        }
        fetchUsers();
    },[]);

    function calculateWinner(){
        let index = 0;
        for (let i = 0; i < game.lobbyData.current_players; i++) {
            if (game.lobbyData.players[i].id == localStorage.getItem('id')) index = i;
        }
        for (let i = 0; i < game.lobbyData.current_players; i++) {
            if (game.players[i].score > game.players[index].score) return false;
        }
        return true;
    }

    let showConfetti = false;
    if (scorePlayer1 != null) {
        showConfetti = calculateWinner();
    }

    return (
        <BaseContainer className="winner container">
            <div className="winner leave-button">
            <Button className="blue-button" onClick={() => history.push('/home')}> &#60; Return </Button>
            </div>
            <div className="winner header"> GAME OVER </div>
            <div className="winner title">Thank you for playing Azul Online!</div>
            <div className="winner player-container">
            <PlayerScore index={0} score={scorePlayer1}/>
            <PlayerScore index={1} score={scorePlayer2}/>
            <PlayerScore index={2} score={scorePlayer3}/>
            <PlayerScore index={3} score={scorePlayer4}/>
            </div>
            <div>
            {showConfetti && <ReactConfetti width={width} height={height} />}
            </div>
        </BaseContainer>
    );

}

export default WinnerPage;
