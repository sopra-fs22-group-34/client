import * as React from "react";
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Winner.scss";
import {Button} from 'components/ui/Button';
import Confetti from "react-confetti";
import useWindowSize from 'react-use/lib/useWindowSize'

const WinnerPage = () => {
    const history = useHistory();

    const { width, height } = useWindowSize();
    return (

        <BaseContainer className="winner container">
            <div className="winner header">
                WINNER WINNER CHICKEN DINNER
            </div>
            <div>
                <Confetti
                    width={width}
                    height={height}
            />
            </div>
        </BaseContainer>
    );

}

export default WinnerPage;
