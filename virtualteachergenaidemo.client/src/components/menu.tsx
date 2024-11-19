import './menu.css';
import {Caption1,Text} from "@fluentui/react-text";
import { Card, CardPreview, CardHeader } from '@fluentui/react-card';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from "../auth/UserRoleContext";
import { UserRoleEnum } from "../models/UserRoleEnum";


const resolveAsset = (asset: string) => {
    const ASSET_URL =
        '/assets/';

    return `${ASSET_URL}${asset}`;
};


function Menu() {
    const navigate = useNavigate();
    const { role } = useUserRole();

    const navigateTraining = () => {
        navigate('/session');
    };

    const navigateScenarios = () => {
        navigate('/scenarios');
    };

    const navigateLastTraining = () => {
        navigate('/lastTraining');
    };

    const navigateCoach = () => {
        navigate('/coach');
    };

    const navigateAgent = () => {
        navigate('/agent');
    }

    return (
        <div className="menu">
            <section>
                <Card className="card" orientation="horizontal" onClick={navigateTraining} >
                    <CardPreview >
                        <img className='horizontalCardImage'
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
                    <CardPreview>
                        <img className='horizontalCardImage'
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

            {/*<section>*/}
            {/*    <Card className="card" orientation="horizontal" onClick={navigateCoach} >*/}
            {/*        <CardPreview>*/}
            {/*            <img className='horizontalCardImage'*/}
            {/*                src={resolveAsset("coach.svg")}*/}
            {/*                alt="App Name Document"*/}
            {/*            />*/}
            {/*        </CardPreview>*/}

            {/*        <CardHeader*/}

            {/*            header={<Text weight="semibold">Virtual AI Coach</Text>}*/}
            {/*            description={*/}
            {/*                <Caption1>Ask anything at your Virtual AI Coach</Caption1>*/}
            {/*            }*/}

            {/*        />*/}
            {/*    </Card>*/}
            {/*</section>*/}


            {role == UserRoleEnum.Admin && (
                <>
                    <section>
                        <Card className="card" orientation="horizontal" onClick={navigateScenarios} >
                            <CardPreview>
                                <img className='horizontalCardImage'
                                    src={resolveAsset("scenario.svg")}
                                    alt="App Name Document"
                                />
                            </CardPreview>

                            <CardHeader
                                header={<Text weight="semibold">Scenario</Text>}
                                description={
                                    <Caption1>Managed your Scenario</Caption1>
                                }
                            />
                        </Card>
                    </section>

                    <section>
                        <Card className="card" orientation="horizontal" onClick={navigateAgent} >
                            <CardPreview>
                                <img className='horizontalCardImage'
                                    src={resolveAsset("agent.svg")}
                                    alt="App Name Document"
                                />
                            </CardPreview>

                            <CardHeader
                                header={<Text weight="semibold">Virtual AI Agent</Text>}
                                description={
                                    <Caption1>Managed your Virtual AI Agent</Caption1>
                                }
                            />
                        </Card>
                    </section>

                </>
            )}
        </div>
    )
};

export default Menu;