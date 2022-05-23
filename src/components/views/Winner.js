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
    let players;
    let lobbyData;
    let player3Box;
    let player4Box;

    //own functional component, such that a winner can get displayed on steps
    function Step(props) {
        return (<div className="winner podium-step">{props.data}</div>)
    }

    function PlayerScore(props){
        let scoreHeight = 150 +(3*props.score);

        return (
            <div className="winner player">
            <Button className="winner box" height={scoreHeight}>
                <div className="winner score"> {props.score} </div>
            </Button>
                <div className="winner name"> {props.name} </div>
            </div>
        );
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
                console.log("What follows next is the players list:");
                console.log(lobbyData.players);

                //tried to include the scores too, but something did not work out...
                setPlayer1(lobbyData.players[0].name);
                //let stepPlayer1 = <Step props = {player1}/>
                setScorePlayer1(players[0].score);

                setPlayer2(lobbyData.players[1].name);
                setScorePlayer2(players[1].score);

                if (lobbyData.current_players > 2) {
                    setPlayer3(lobbyData.players[2].name);
                    setScorePlayer3(players[2].score);
                    console.log("The score of player three is: " + scorePlayer3);
                    player3Box = (<div>TEST!!!!<PlayerScore name={player3} score={scorePlayer3} /></div>);
                }
                if (lobbyData.current_players > 3) {
                    setPlayer4(lobbyData.players[3].name);
                    setScorePlayer4(players[3].score);
                    player4Box = (<PlayerScore name={player4} score={scorePlayer4} />)
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

    if (lobbyData) {
        console.log("lobbyData does exist!!");
    }



    return (

        <BaseContainer className="winner container">
            <Button className="blue-button margin" width="50%" onClick={() => history.push('home')} >
                &#60; Return
            </Button>
            <div className="winner header">
                GAME OVER
            </div>
            <div className="winner title">Thank you for playing Azul!</div>
            <div className="winner player-container">
            <PlayerScore name={player1} score={scorePlayer1}/>
            <PlayerScore name={player2} score={scorePlayer2}/>
                {player3Box}
                {player4Box}
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
