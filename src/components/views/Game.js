import * as React from "react";
import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import {buildGetRequestExternalAPI} from "./User";

const GamePage = () => {
    const history = useHistory();
    const [timer, setTimer] = React.useState(30 + " seconds");
    let [view, setView] = useState(null);
    let [game, setGame] = useState(null);
    let [originIndex, setOriginIndex] = useState(null);
    let [colorIndex, setColorIndex] = useState(null);
    let [tileAmount, setTileAmount] = useState(null);
    let [playerIndex, setPlayerIndex] = useState(0);

    function TurnOrder(props) {
        let namePlayer1 = (<PlayerInfo index={0} name={props.data.playerData.nameOne} userId={props.data.playerData.one} data={props.data}/>);
        let namePlayer2 = (<PlayerInfo index={1} name={props.data.playerData.nameTwo} userId={props.data.playerData.two} data={props.data}/>);
        let namePlayer3, namePlayer4;
        if (props.data.playerData.current_players >= 3) { namePlayer3 = (<PlayerInfo index={2} name={props.data.playerData.nameThree} userId={props.data.playerData.three} data={props.data}/>); }
        if (props.data.playerData.current_players == 4) { namePlayer4 = (<PlayerInfo index={3} name={props.data.playerData.nameFour} userId={props.data.playerData.four} data={props.data}/>); }
        return (<div className="game turn-order">
                   {namePlayer1} {namePlayer2} {namePlayer3} {namePlayer4}
                </div>);
    }

    function PlayerInfo(props){
        let id = props.index;
        let width = "100%";
        if (props.data.players[id].playerId == props.data.playerTurnId) width = "150%";
        if (props.data.players[id].playerId == playerIndex) {
            return (<Button className="player-turn you" width={width} onMouseOut={()=>{setView(null)}} onMouseOver={()=>{setView(id)}}>
                        <div className="game image"><img src={buildGetRequestExternalAPI(props.userId)}/></div>
                        {props.name} <div className="game score">{props.data.players[id].score}</div>
                    </Button>)}
        else return (<Button className="player-turn" width={width} onMouseOut={()=>{setView(null)}} onMouseOver={()=>{setView(id)}}>
                         <div className="game image"><img src={buildGetRequestExternalAPI(props.userId)}/></div>
                         {props.name} <div className="game score">{props.data.players[id].score}</div>
                     </Button>)
    }

    function MiddleTiles(props){
        let zero, col1, col2, col3, col4, col5;

        if (props.zero) { zero = (<Tile color={5} amount={1}/>);}
        if (props.col1 > 0) { col1 = (<Tile color={0} amount={props.col1} origin={-1}/>);}
        if (props.col2 > 0) { col2 = (<Tile color={1} amount={props.col2} origin={-1}/>);}
        if (props.col3 > 0) { col3 = (<Tile color={2} amount={props.col3} origin={-1}/>);}
        if (props.col4 > 0) { col4 = (<Tile color={3} amount={props.col4} origin={-1}/>);}
        if (props.col5 > 0) { col5 = (<Tile color={4} amount={props.col5} origin={-1}/>);}

        return (<div className="game tiles-container">
                    {zero} {col1} {col2} {col3} {col4} {col5} </div>)
    }

    function Tile(props){
        let inactive = false;
        if (props.inactive || game.playerTurnId != playerIndex) { inactive = true; }
        else {inactive = false;}
        let amount = " ";
        if (props.amount) amount = props.amount;
        if (props.amount == 0) return null;
        if (props.color == 0) return (<Button className="tile button-1" disabled={inactive} onClick={() => pickUpTiles(props)}>{amount}</Button>);
        else if (props.color == 1) return (<Button className="tile button-2" disabled={inactive} onClick={() => pickUpTiles(props)}>{amount}</Button>);
        else if (props.color == 2) return (<Button className="tile button-3" disabled={inactive} onClick={() => pickUpTiles(props)}>{amount}</Button>);
        else if (props.color == 3) return (<Button className="tile button-4" disabled={inactive} onClick={() => pickUpTiles(props)}>{amount}</Button>);
        else if (props.color == 4) return (<Button className="tile button-5" disabled={inactive} onClick={() => pickUpTiles(props)}>{amount}</Button>);
        else if (props.color == 5) return (<Button className="tile button-0" disabled={true}>{amount}</Button>);
        else return (<div className="tile empty"/>);
    }

    function pickUpTiles(props) {
        setOriginIndex(props.origin);
        setColorIndex(props.color);
        if (props.total != null) setTileAmount(props.total);
        else setTileAmount(props.amount);
        console.log("function origin: " + originIndex);
        console.log("function color: " + colorIndex);
        console.log("function amount: " + tileAmount);
    }

    async function placeTiles(row){
        console.log("playerIndex: "+playerIndex);
        console.log("targetRowIndex: " + row);
        let targetRowIndex = row;
        try {
            const move = JSON.stringify({originIndex, colorIndex, targetRowIndex, tileAmount, playerIndex});
            console.log("move = " + move);
            api.put("/lobbies/"+localStorage.getItem("lobby")+"/game/moves", move);
            setOriginIndex(null);
            setColorIndex(null);
            setTileAmount(null);
        } catch (error) {
            console.error(`Something went wrong while executing the move: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while executing the move! See the console for details.");
        }
    }

    function MiddleFactories(props){
        let fact1 = (<Factory factoryIndex={0} factories={props.factories}/>);
        let fact2 = (<Factory factoryIndex={1} factories={props.factories}/>);
        let fact3 = (<Factory factoryIndex={2} factories={props.factories}/>);
        let fact4 = (<Factory factoryIndex={3} factories={props.factories}/>);
        let fact5 = (<Factory factoryIndex={4} factories={props.factories}/>);
        let fact6, fact7, fact8, fact9;
        if (props.factoryAmount >= 7) {
            fact6 = (<Factory factoryIndex={5} factories={props.factories}/>);
            fact7 = (<Factory factoryIndex={6} factories={props.factories}/>);}
        if (props.factoryAmount == 9) {
            fact8 = (<Factory factoryIndex={7} factories={props.factories}/>);
            fact9 = (<Factory factoryIndex={8} factories={props.factories}/>);}
        return (<div className="game factories-container">
                    {fact1} {fact2} {fact3} {fact4} {fact5} {fact6} {fact7} {fact8} {fact9} </div>)
    }

    function Factory(props){
        let color1=null,color2=null,color3=null,color4=null;
        let amount1=0,amount2=0,amount3=0,amount4=0;
        let colorAmounts = props.factories[props.factoryIndex].colorAmounts;

        for (let i = 0; i < 5; i++){
            for (let j = 0; j < colorAmounts[i]; j++){
                if (color1 == null) {
                  color1 = i;
                  amount1 = colorAmounts[i];
                }
                else if (color2 == null) {
                  color2 = i;
                  amount2 = colorAmounts[i];
                }
                else if (color3 == null) {
                  color3 = i;
                  amount3 = colorAmounts[i];
                }
                else if (color4 == null) {
                  color4 = i;
                  amount4 = colorAmounts[i];
                }
              }
          }

        return (<div className="factory container">
                    <div className="factory row">
                      <Tile color={color1} total={amount1} origin={props.factoryIndex}/>
                      <Tile color={color2} total={amount2} origin={props.factoryIndex}/>
                    </div>
                    <div className="factory row">
                      <Tile color={color3} total={amount3} origin={props.factoryIndex}/>
                      <Tile color={color4} total={amount4} origin={props.factoryIndex}/>
                    </div>
                  </div>)
    }

    function Stairs(props){
        return (<div className="game stairs-container">
                <StairLine length={1} colorIndex={props.stairs[0].colorIndex} tilesAmount={props.stairs[0].tilesAmount}/>
                <StairLine length={2} colorIndex={props.stairs[1].colorIndex} tilesAmount={props.stairs[1].tilesAmount}/>
                <StairLine length={3} colorIndex={props.stairs[2].colorIndex} tilesAmount={props.stairs[2].tilesAmount}/>
                <StairLine length={4} colorIndex={props.stairs[3].colorIndex} tilesAmount={props.stairs[3].tilesAmount}/>
                <StairLine length={5} colorIndex={props.stairs[4].colorIndex} tilesAmount={props.stairs[4].tilesAmount}/></div>)
    }

    function StairLine(props){
        let inactive = false;
        if ((view == null && game.playerTurnId != playerIndex) || (view != null && game.playerTurnId != view)) inactive = true;
        let tiles = null;
        let tile = (<div className="game placed-tile"><Tile color={props.colorIndex} inactive={true}/></div>);
        // Tiles that can be placed on the stairs (purely visual)
        if (props.tilesAmount == 1) tiles = (<div className="game placed-tiles">{tile}</div>);
        else if (props.tilesAmount == 2) tiles = (<div className="game placed-tiles">{tile} {tile}</div>);
        else if (props.tilesAmount == 3) tiles = (<div className="game placed-tiles">{tile} {tile} {tile}</div>);
        else if (props.tilesAmount == 4) tiles = (<div className="game placed-tiles">{tile} {tile} {tile} {tile}</div>);
        else if (props.tilesAmount == 5) tiles = (<div className="game placed-tiles">{tile} {tile} {tile} {tile} {tile}</div>);
        // The stairs themselves (buttons)
        if (props.length == 1) return (<Button className="stairs back-1" disabled={inactive} onClick={() => placeTiles(0)}>{tiles}</Button>);
        else if (props.length == 2) return (<Button className="stairs back-2" disabled={inactive} onClick={() => placeTiles(1)}>{tiles}</Button>);
        else if (props.length == 3) return (<Button className="stairs back-3" disabled={inactive} onClick={() => placeTiles(2)}>{tiles}</Button>);
        else if (props.length == 4) return (<Button className="stairs back-4" disabled={inactive} onClick={() => placeTiles(3)}>{tiles}</Button>);
        else if (props.length == 5) return (<Button className="stairs back-5" disabled={inactive} onClick={() => placeTiles(4)}>{tiles}</Button>);
    }

    function Wall(props){
        let row1 = (<WallRow row={0} positionsOccupied={props.positionsOccupied} />);
        let row2 = (<WallRow row={1} positionsOccupied={props.positionsOccupied} />);
        let row3 = (<WallRow row={2} positionsOccupied={props.positionsOccupied} />);
        let row4 = (<WallRow row={3} positionsOccupied={props.positionsOccupied} />);
        let row5 = (<WallRow row={4} positionsOccupied={props.positionsOccupied} />);
        return (<div className="game wall">{row1} {row2} {row3} {row4} {row5} </div>);
    }

    function WallRow(props){
        let tile1 = (<WallTile color={props.row} occupied={props.positionsOccupied[props.row][0]}/>);
        let tile2 = (<WallTile color={(props.row+4)%5} occupied={props.positionsOccupied[props.row][1]}/>);
        let tile3 = (<WallTile color={(props.row+3)%5} occupied={props.positionsOccupied[props.row][2]}/>);
        let tile4 = (<WallTile color={(props.row+2)%5} occupied={props.positionsOccupied[props.row][3]}/>);
        let tile5 = (<WallTile color={(props.row+1)%5} occupied={props.positionsOccupied[props.row][4]}/>);
        return (<div className="wall row">{tile1} {tile2} {tile3} {tile4} {tile5} </div>);
    }

    function WallTile(props){
        let tile;
        if (props.occupied) tile = (<Tile color={props.color} inactive={true}/>);
        if (props.color == 0) return (<div className="wall-tile tile-1">{tile}</div>);
        else if (props.color == 1) return (<div className="wall-tile tile-2">{tile}</div>);
        else if (props.color == 2) return (<div className="wall-tile tile-3">{tile}</div>);
        else if (props.color == 3) return (<div className="wall-tile tile-4">{tile}</div>);
        else if (props.color == 4) return (<div className="wall-tile tile-5">{tile}</div>);
    }

    function FloorLine(props){
        return (<div className="game floorline">
            <FloorTile value={-1} id={0} data={props.floorline}/>
            <FloorTile value={-1} id={1} data={props.floorline}/>
            <FloorTile value={-2} id={2} data={props.floorline}/>
            <FloorTile value={-2} id={3} data={props.floorline}/>
            <FloorTile value={-2} id={4} data={props.floorline}/>
            <FloorTile value={-3} id={5} data={props.floorline}/>
            <FloorTile value={-3} id={6} data={props.floorline}/>
        </div>)
    }

    function FloorTile(props){
        let tile = (<Tile color={props.data[props.id]} inactive={true}/>);
        return (<div className="floor container">
            <div className="floor value-container">{props.value}</div>
            <div className="floor tile-container">{tile}</div>
        </div>)
    }

    useEffect(() => {
        async function fetchData() {
            try {
                let currentGame = await api.get("/lobbies/"+localStorage.getItem('lobby')+"/game");
                let game = currentGame.data;
                setGame(game);
                console.log("game:");
                console.log(game);
                let players = game.playerData;
                if (players.one == localStorage.getItem('id')) {setPlayerIndex(0);}
                else if (players.two == localStorage.getItem('id')) {setPlayerIndex(1);}
                else if (players.three == localStorage.getItem('id')) {setPlayerIndex(2);}
                else if (players.four == localStorage.getItem('id')) {setPlayerIndex(3);}
            } catch (error) {
                console.error(`Something went wrong while fetching the game data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the game data! See the console for details.");
            }
        }
        const interval = setInterval(() => {
          fetchData();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    let turnOrder;
    let yourTurn;
    let middle;
    let factories;
    let stairs;
    let wall;
    let floor;

    //Timer function
    React.useEffect(() => {
        const countDown = timer > 0 && setInterval(() => setTimer(timer -1), 1000);
        return () => clearInterval(countDown);
    }, [timer]);

    if (game) {
        if (game.playerTurnId == playerIndex) { yourTurn = (<div className="game your-turn">It's your turn! <br/> Timer: {timer}</div>); }
        else { yourTurn = null; }
        turnOrder = (<TurnOrder data={game}/>);
        middle = (<MiddleTiles zero={game.middle.hasMinusTile} col1={game.middle.colorAmounts[0]} col2={game.middle.colorAmounts[1]} col3={game.middle.colorAmounts[2]} col4={game.middle.colorAmounts[3]} col5={game.middle.colorAmounts[4]}/>);
        factories = (<MiddleFactories factoryAmount={game.factoryAmount} factories={game.factories}/>);
        if (view != null) {
            stairs = (<Stairs stairs={game.players[view].playerBoard.stairs}/>);
            wall = (<Wall positionsOccupied={game.players[view].playerBoard.wall.positionsOccupied}/>);
            floor = (<FloorLine floorline={game.players[view].playerBoard.floorLine}/>);
        } else {
            stairs = (<Stairs stairs={game.players[playerIndex].playerBoard.stairs}/>);
            wall = (<Wall positionsOccupied={game.players[playerIndex].playerBoard.wall.positionsOccupied}/>);
            floor = (<FloorLine floorline={game.players[playerIndex].playerBoard.floorLine}/>);
        }
    }

    let viewedBoard = (<div className="board container">
            <div className="board main">{stairs} {wall} </div> {floor} </div>);

    return (
        <BaseContainer className="game container">
            <div className="game field">
                <div className="middle container">

                    {factories}
                    {middle}
                </div>
            </div>
            <div className="game board">
                {yourTurn}
                {viewedBoard}
                {turnOrder}
            </div>
        </BaseContainer>
    );

}

export default GamePage;
