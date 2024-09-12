import './menu.css';


import {

    Caption1,
    Text
} from "@fluentui/react-components";

import { Card, CardPreview, CardHeader } from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';


const resolveAsset = (asset: string) => {
    const ASSET_URL =
        '/assets/';

    return `${ASSET_URL}${asset}`;
};


function Menu() {
    const navigate = useNavigate();

    const navigateTraining = () => {
        navigate('/training');
    };
    const navigateLastTraining = () => {
        navigate('/lastTraining');
    };

    const navigateCoach = () => {
        navigate('/coach');
    };

    return (
        <div className="menu">
            <section>
                <Card className="card" orientation="horizontal" onClick={navigateTraining} >
                    <CardPreview className='horizontalCardImage'>
                        <img

                            src={resolveAsset("chat.svg")}
                            alt="App Name Document"
                        />
                    </CardPreview>

                    <CardHeader

                        header={<Text weight="semibold">Practice for the sales ceremony</Text>}
                        description={
                            <Caption1>Use AI and help you to practice your skills</Caption1>
                        }

                    />
                </Card>
            </section>

            <section>
                <Card className="card" orientation="horizontal" onClick={navigateLastTraining} >
                    <CardPreview className='horizontalCardImage'>
                        <img
                            src={resolveAsset("dashboard.svg")}
                            alt="App Name Document"
                        />
                    </CardPreview>

                    <CardHeader

                        header={<Text weight="semibold">My last training</Text>}
                        description={
                            <Caption1>See all your last trainings with AI insight</Caption1>
                        }

                    />
                </Card>
            </section>

            <section>
                <Card className="card" orientation="horizontal" onClick={navigateCoach} >
                    <CardPreview className='horizontalCardImage'>
                        <img
                            src={resolveAsset("coach.svg")}
                            alt="App Name Document"
                        />
                    </CardPreview>

                    <CardHeader

                        header={<Text weight="semibold">Virtual AI Coach</Text>}
                        description={
                            <Caption1>Ask anything at your Virtual AI Coach</Caption1>
                        }

                    />
                </Card>
            </section>
        </div>
    )
};

export default Menu;