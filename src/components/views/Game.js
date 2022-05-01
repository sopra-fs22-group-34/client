import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

function MiddleTiles(props){
    let zero, col1, col2, col3, col4, col5;

    if (props.zero == true) { zero = (<Tile color={6} amount={1}/>);}
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
    else return (<Button className="tile button-0" disabled={true}>{amount}</Button>);
}

function pickUpTiles(props) {
  let originIndex = props.origin;
  let colorIndex = props.color;
  let tileAmount;
  if (props.total != null) tileAmount = props.total;
  else tileAmount = props.amount;
  console.log(originIndex);
  console.log(colorIndex);
  console.log(tileAmount);
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
    if (props.length == 1) return (<Button className="stairs back-1">{tiles}</Button>);
    else if (props.length == 2) return (<Button className="stairs back-2">{tiles}</Button>);
    else if (props.length == 3) return (<Button className="stairs back-3">{tiles}</Button>);
    else if (props.length == 4) return (<Button className="stairs back-4">{tiles}</Button>);
    else if (props.length == 5) return (<Button className="stairs back-5">{tiles}</Button>);
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


const GamePage = props => {
    const history = useHistory();
    const [view, setView] = useState(localStorage.getItem('id'));
    const [game, setGame] = useState({"middle":{"hasMinusTile":true,"colorAmounts":[0,0,0,0,0]},"playerTurnId":1,
                                     "playerAmount":2,"players":[{"score":0,"playerId":0,"playerBoard":{"stairs":
                                                 [{"length":1,"colorIndex":0,"tilesAmount":1},
                                                 {"length":2,"colorIndex":1,"tilesAmount":2},
                                                 {"length":3,"colorIndex":2,"tilesAmount":3},
                                                 {"length":4,"colorIndex":3,"tilesAmount":4},
                                                 {"length":5,"colorIndex":4,"tilesAmount":5}],
                                             "floorLine":[],"wall":{
                                                 "colorsOccupied":
                                                     [[true,true,false,false,false],
                                                     [false,false,false,false,false],
                                                     [false,false,false,false,false],
                                                     [false,false,false,false,false],
                                                     [false,false,false,false,false]],
                                                 "positionsOccupied":
                                                     [[true,true,true,true,true],
                                                     [false,false,false,false,false],
                                                     [false,false,false,false,false],
                                                     [false,false,false,false,false],
                                                     [false,false,false,false,false]]}}},
                                         {"score":0,"playerId":1,"playerBoard":{"stairs":
                                                 [{"length":1,"colorIndex":-1,"tilesAmount":0},
                                                 {"length":2,"colorIndex":-1,"tilesAmount":0},
                                                 {"length":3,"colorIndex":-1,"tilesAmount":0},
                                                 {"length":4,"colorIndex":-1,"tilesAmount":0},
                                                 {"length":5,"colorIndex":-1,"tilesAmount":0}],
                                                 "floorLine":[],"wall":{
                                                     "colorsOccupied":
                                                         [[false,false,false,false,false],
                                                         [false,false,false,false,false],
                                                         [false,false,false,false,false],
                                                         [false,false,false,false,false],
                                                         [false,false,false,false,false]],
                                                     "positionsOccupied":
                                                         [[false,false,false,false,false],
                                                         [false,false,false,false,false],
                                                         [false,false,false,false,false],
                                                         [false,false,false,false,false],
                                                         [false,false,false,false,false]]}}}],
                                     "factories":[{"colorAmounts":[0,0,0,2,2]},{"colorAmounts":[2,1,0,1,0]},{"colorAmounts":[0,3,0,1,0]},{"colorAmounts":[1,0,1,2,0]},{"colorAmounts":[2,1,0,0,1]}],"factoryAmount":5}
);
    const [factories, setFactories] = useState([{"colorAmounts":[0,0,0,2,2]},{"colorAmounts":[2,1,0,1,0]},{"colorAmounts":[0,3,0,1,0]},{"colorAmounts":[1,0,1,2,0]},{"colorAmounts":[2,1,0,0,1]}]);
    const [middle, setMiddle] = useState({"hasMinusTile":true,"colorAmounts":[0,0,0,0,0]});



    useEffect(() => {
        async function fetchData() {
            try {
                console.log("Hi");
                setFactories(game.factories);
                setMiddle(game.middle);
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

    let content = null;

    return (
        <BaseContainer className="game container">
            <div className="game field">
                <div className="middle container">
                    <MiddleTiles zero={middle.hasMinusTile} col1={middle.colorAmounts[0]} col2={middle.colorAmounts[1]} col3={middle.colorAmounts[2]} col4={middle.colorAmounts[3]} col5={middle.colorAmounts[4]}/>
                    <MiddleFactories factoryAmount={game.factoryAmount} factories={factories}/>
                </div>
            </div>
            <div className="game board">
                <Stairs stairs={game.players[0].playerBoard.stairs}/>
                <Wall positionsOccupied={game.players[0].playerBoard.wall.positionsOccupied}/>
            </div>
        </BaseContainer>
    );

}

export default GamePage;
