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

    if (props.zero == true) { zero = (<Tile color={0} amount={1}/>);}
    if (props.col1 > 0) { col1 = (<Tile color={1} amount={props.col1}/>);}
    if (props.col2 > 0) { col2 = (<Tile color={2} amount={props.col2}/>);}
    if (props.col3 > 0) { col3 = (<Tile color={3} amount={props.col3}/>);}
    if (props.col4 > 0) { col4 = (<Tile color={4} amount={props.col4}/>);}
    if (props.col5 > 0) { col5 = (<Tile color={5} amount={props.col5}/>);}

    return (<div className="game tiles-container">
                {zero} {col1} {col2} {col3} {col4} {col5}
            </div>)
}

function Tile(props){
    let amount = " ";
    if (props.amount) amount = props.amount;
    if (props.amount == 0) return null;
    if (props.color == 1) return (<Button className="tile button-1">{amount}</Button>);
    else if (props.color == 2) return (<Button className="tile button-2">{amount}</Button>);
    else if (props.color == 3) return (<Button className="tile button-3">{amount}</Button>);
    else if (props.color == 4) return (<Button className="tile button-4">{amount}</Button>);
    else if (props.color == 5) return (<Button className="tile button-5">{amount}</Button>);
    else if (props.color == 0) return (<Button className="tile button-0">{amount}</Button>);
    else return null;
}
function MiddleFactories(props){
    let fact1 = (<Factory colorAmounts={props.factories[0].colorAmounts}/>);
    let fact2 = (<Factory colorAmounts={props.factories[1].colorAmounts}/>);
    let fact3 = (<Factory colorAmounts={props.factories[2].colorAmounts}/>);
    let fact4 = (<Factory colorAmounts={props.factories[3].colorAmounts}/>);
    let fact5 = (<Factory colorAmounts={props.factories[4].colorAmounts}/>);
    let fact6, fact7, fact8, fact9;
    if (props.factoryAmount >= 7) {
        fact6 = (<Factory colorAmounts={props.factories[5].colorAmounts}/>);
        fact7 = (<Factory colorAmounts={props.factories[6].colorAmounts}/>);
    }
    if (props.factoryAmount == 9) {
        fact8 = (<Factory colorAmounts={props.factories[7].colorAmounts}/>);
        fact9 = (<Factory colorAmounts={props.factories[8].colorAmounts}/>);
    }
    return (<div className="game factories-container">
                {fact1} {fact2} {fact3} {fact4} {fact5} {fact6} {fact7} {fact8} {fact9}
            </div>)
}
function Factory(props){
    let tile1=null,tile2=null,tile3=null,tile4=null;

    for (let i = 0; i < 5; i++){
        for (let j = 0; j < props.colorAmounts[i]; j++){
            if (tile1 == null) tile1 = i+1;
            else if (tile2 == null) tile2 = i+1;
            else if (tile3 == null) tile3 = i+1;
            else if (tile4 == null) tile4 = i+1;
        }
    }

    return (<div className="factory container">
                <div className="factory row"><Tile color={tile1}/> <Tile color={tile2}/></div>
                <div className="factory row"><Tile color={tile3}/> <Tile color={tile4}/></div>
            </div>)
}

const GamePage = props => {
    const history = useHistory();
    const [view, setView] = useState(localStorage.getItem('id'));
    const [game, setGame] = useState(null);
    const [factories, setFactories] = useState([{"colorAmounts":[0,0,0,2,2]},{"colorAmounts":[2,1,0,1,0]},{"colorAmounts":[0,3,0,1,0]},{"colorAmounts":[1,0,1,2,0]},{"colorAmounts":[2,1,0,0,1]}]);
    const [middle, setMiddle] = useState({"hasMinusTile":true,"colorAmounts":[1,2,3,4,5]}); // change to [0,0,0,0,0]

    useEffect(() => {
        async function fetchData() {
            try {
                console.log("Hi");
            } catch (error) {
                console.error(`Something went wrong while fetching the game data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the game data! See the console for details.");
            }
        }
        fetchData();
    }, []);

    let content = null;

    return (
        <BaseContainer className="game container">
            <div className="game field">
                <div className="middle container">
                    <MiddleTiles zero={middle.hasMinusTile} col1={middle.colorAmounts[0]} col2={middle.colorAmounts[1]} col3={middle.colorAmounts[2]} col4={middle.colorAmounts[3]} col5={middle.colorAmounts[4]}/>
                    <MiddleFactories factoryAmount={5} factories={factories}/>
                </div>
            </div>
            <div className="game board">
            </div>
        </BaseContainer>
    );

}

export default GamePage;