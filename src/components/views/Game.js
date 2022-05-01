import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

const GamePage = props => {
    const history = useHistory();
    const [view, setView] = useState(localStorage.getItem('id'));
    const [game, setGame] = useState(null);
    let [originIndex, setOriginIndex] = useState(null);
    let [colorIndex, setColorIndex] = useState(null);
    let [tileAmount, setTileAmount] = useState(null);
    const [players, setPlayers] = useState(null);
    const [playerIndex, setPlayerIndex] = useState(1);

    async function getUserNames(users) {
        console.log("This is the list with the userIDs: ");
        console.log(users);
        console.log("This is the first userID of the list: users[0]");
        console.log(users[0]);
        let userId1 = users[0];
        let userId2 = users[1];
        let userId3, userId4;
        let username1, username2, username3, username4;
        try {
            const user1 = await api.get("/users/" + userId1);
            username1 = user1.data.username;

            const user2 = await api.get("/users/" + userId2);
            username2 = user2.data.username;

            if (!(userId3 == null)) {
                let userId3 = users[2];
                const user3 = await api.get("/users/" + userId3);
                username3 = user3.data.username;
            }
            if (!(userId4 == null)) {
                let userId4 = users[3];
                const user4 = await api.get("/users/" + userId4);
                username4 = user4.data.username;
            }
        } catch (error) {
            console.error(`Something went wrong while fetching the usernames: \n${handleError(error)}`)
        }
        return [username1, username2, username3, username4]
    }

    function TurnOrder({players}) {
        let usernames = getUserNames(players);
        let turnOrder;
        const namePlayer1 = usernames[0];
        const namePlayer2 = usernames[1];
        turnOrder = (<div className={"turnOrder container"}>
            <div className="username container">{namePlayer1}</div>
            <div className="username container">{namePlayer2}</div>
        </div>);
        if (usernames.length === 3) {
            const namePlayer3 = usernames[2];
            turnOrder = (<div className={"turnOrder container"}>
                <div className="username container">{namePlayer1}</div>
                <div className="username container">{namePlayer2}</div>
                <div className="username container">{namePlayer3}</div>
            </div>);
        }
        if (usernames.length === 4) {
            const namePlayer3 = usernames[2];
            const namePlayer4 = usernames[3];
            turnOrder = (<div className={"turnOrder container"}>
                <div className="username container">{namePlayer1}</div>
                <div className="username container">{namePlayer2}</div>
                <div className="username container">{namePlayer3}</div>
                <div className="username container">{namePlayer4}</div>
            </div>);
        }
        return turnOrder;
    }

    function MiddleTiles(props){
        let zero, col1, col2, col3, col4, col5;

        if (props.zero == true) { zero = (<Tile color={5} amount={1}/>);}
        if (props.col1 > 0) { col1 = (<Tile color={0} amount={props.col1} origin={-1}/>);}
        if (props.col2 > 0) { col2 = (<Tile color={1} amount={props.col2} origin={-1}/>);}
        if (props.col3 > 0) { col3 = (<Tile color={2} amount={props.col3} origin={-1}/>);}
        if (props.col4 > 0) { col4 = (<Tile color={3} amount={props.col4} origin={-1}/>);}
        if (props.col5 > 0) { col5 = (<Tile color={4} amount={props.col5} origin={-1}/>);}

        return (<div className="game tiles-container">
                    {zero} {col1} {col2} {col3} {col4} {col5} </div>)
    }

    function Tile(props){
        let amount = " ";
        if (props.amount) amount = props.amount;
        if (props.amount == 0) return null;
        if (props.color == 0) return (<Button className="tile button-1" disabled={props.inactive} onClick={() => pickUpTiles(props)}>{amount}</Button>);
        else if (props.color == 1) return (<Button className="tile button-2" disabled={props.inactive} onClick={() => pickUpTiles(props)}>{amount}</Button>);
        else if (props.color == 2) return (<Button className="tile button-3" disabled={props.inactive} onClick={() => pickUpTiles(props)}>{amount}</Button>);
        else if (props.color == 3) return (<Button className="tile button-4" disabled={props.inactive} onClick={() => pickUpTiles(props)}>{amount}</Button>);
        else if (props.color == 4) return (<Button className="tile button-5" disabled={props.inactive} onClick={() => pickUpTiles(props)}>{amount}</Button>);
        else if (props.color == 5) return (<Button className="tile button-0" disabled={true}>{amount}</Button>);
        else return null;
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
            console.log("oh naurr");
            console.error("Details:", error);
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
        let tiles = null;
        let tile = (<Tile color={props.colorIndex} inactive={true}/>);
        if (props.tilesAmount == 1) tiles = (<div className="game placed-tiles">{tile}</div>);
        else if (props.tilesAmount == 2) tiles = (<div className="game placed-tiles">{tile} {tile}</div>);
        else if (props.tilesAmount == 3) tiles = (<div className="game placed-tiles">{tile} {tile} {tile}</div>);
        else if (props.tilesAmount == 4) tiles = (<div className="game placed-tiles">{tile} {tile} {tile} {tile}</div>);
        else if (props.tilesAmount == 5) tiles = (<div className="game placed-tiles">{tile} {tile} {tile} {tile} {tile}</div>);
        let stair = (<Button className="stairs back-1"/>);
        if (props.length == 1) return (<Button className="stairs back-1" onClick={() => placeTiles(0)}>{tiles}</Button>);
        else if (props.length == 2) return (<Button className="stairs back-2" onClick={() => placeTiles(1)}>{tiles}</Button>);
        else if (props.length == 3) return (<Button className="stairs back-3" onClick={() => placeTiles(2)}>{tiles}</Button>);
        else if (props.length == 4) return (<Button className="stairs back-4" onClick={() => placeTiles(3)}>{tiles}</Button>);
        else if (props.length == 5) return (<Button className="stairs back-5" onClick={() => placeTiles(4)}>{tiles}</Button>);
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

    useEffect(() => {
        async function fetchData() {
            try {
                const currentGame = await api.get("/users/"+localStorage.getItem("id")+"/game");
                setGame(currentGame.data);
                console.log("game:");
                console.log(game);
                console.log("game origin: " + originIndex);
                console.log("game color: " + colorIndex);
                console.log("game amount: " + tileAmount);
            } catch (error) {
                console.error(`Something went wrong while fetching the game data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the game data! See the console for details.");
            }
        }
        async function getPlayers() {
            try {
                const playerResponse = await api.get("/lobbies/" + localStorage.getItem("lobby") + "/game/players");
                setPlayers(playerResponse.data);
                for (let id = 0; id < 4; id++) {
                    if ((id+1).toString() === localStorage.getItem("id")) {
                        setPlayerIndex(id);
                    }
                }
                console.log("players:");
                console.log(players);
                console.log("player index:");
                console.log(playerIndex);
            } catch (error) {
                console.error(`Something went wrong while fetching the players: \n${handleError(error)}`);
            }
        }
        const interval = setInterval(() => {
          fetchData();
        }, 5000);
        getPlayers();
        return () => clearInterval(interval);
    }, []);

    let turnOrder;
    //if (players) { turnOrder = (<TurnOrder players = {players}/>) }
    let yourTurn;
    let middle;
    let factories;
    let stairs;
    let wall;
    if (game) {
        if (game.playerTurnId == playerIndex) { yourTurn = (<div className="game your-turn">"It's your turn!"</div>); }
        else { yourTurn = null; }
        middle = (<MiddleTiles zero={game.middle.hasMinusTile} col1={game.middle.colorAmounts[0]} col2={game.middle.colorAmounts[1]} col3={game.middle.colorAmounts[2]} col4={game.middle.colorAmounts[3]} col5={game.middle.colorAmounts[4]}/>);
        factories = (<MiddleFactories factoryAmount={game.factoryAmount} factories={game.factories}/>);
        stairs = (<Stairs stairs={game.players[playerIndex].playerBoard.stairs}/>);
        wall = (<Wall positionsOccupied={game.players[playerIndex].playerBoard.wall.positionsOccupied}/>);
    }

    return (
        <BaseContainer className="game container">
            <div className="game field">
                {turnOrder}
                <div className="middle container">
                    {yourTurn}
                    {factories}
                    {middle}
                </div>
            </div>
            <div className="game board">
                {stairs}
                {wall}
            </div>
        </BaseContainer>
    );

}

export default GamePage;
