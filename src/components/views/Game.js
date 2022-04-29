import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

function MiddleTiles(props){
    let zero = null;
    let col1 = null;
    let col2 = null;
    let col3 = null;
    let col4 = null;
    let col5 = null;

    if (props.zero > 0) { zero = (<Tile color={0} amount={props.zero}/>);}
    if (props.col1 > 0) { col1 = (<Tile color={1} amount={props.col1}/>);}
    if (props.col2 > 0) { col2 = (<Tile color={2} amount={props.col2}/>);}
    if (props.col3 > 0) { col3 = (<Tile color={3} amount={props.col3}/>);}
    if (props.col4 > 0) { col4 = (<Tile color={4} amount={props.col4}/>);}
    if (props.col5 > 0) { col5 = (<Tile color={5} amount={props.col5}/>);}

    return (
        <div className="game tiles-container">
            {zero} {col1} {col2} {col3} {col4} {col5}
        </div>
    )
}

function Tile(props){
    if (props.color == 1) return (<Button className="tile button-1">{props.amount}</Button>);
    else if (props.color == 2) return (<Button className="tile button-2">{props.amount}</Button>);
    else if (props.color == 3) return (<Button className="tile button-3">{props.amount}</Button>);
    else if (props.color == 4) return (<Button className="tile button-4">{props.amount}</Button>);
    else if (props.color == 5) return (<Button className="tile button-5">{props.amount}</Button>);
    else return (<Button className="tile button-0">{props.amount}</Button>);
}

const GamePage = props => {
    const history = useHistory();
    const [view, setView] = useState(localStorage.getItem('id'));
    const [game, setGame] = useState(null);

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
                <div className="middle container">
                    <MiddleTiles zero={1}/>
                </div>
        </BaseContainer>
    );

}

export default GamePage;