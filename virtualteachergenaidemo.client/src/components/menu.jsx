import './menu.css';
import React from 'react';
import { Body1, Button } from '@fluentui/react-components';
import {
    makeStyles,
    Caption1,
    Text
} from "@fluentui/react-components";
import { MoreHorizontal20Regular } from "@fluentui/react-icons";
import { Card, CardPreview, CardHeader } from '@fluentui/react-components';
import { useNavigate, Link } from 'react-router-dom';


const resolveAsset = (asset) => {
    const ASSET_URL =
        '/assets/';

    return `${ASSET_URL}${asset}`;
};


function Menu(props) {
    const navigate = useNavigate();

    const navigateTraining = () => {
        navigate('/training');
    };
    const navigateDashboard= () => {
        navigate('/dashboard');
    };

    const navigateCoach = () => {
        navigate('/coach');
    };

    return (
        <div>
            <section>                
                <Card orientation="horizontal" onClick={navigateTraining} >
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
                <Card orientation="horizontal" onClick={navigateDashboard} >
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
                <Card orientation="horizontal" onClick={navigateCoach} >
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