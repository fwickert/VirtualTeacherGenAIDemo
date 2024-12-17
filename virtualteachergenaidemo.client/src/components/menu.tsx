import './menu.css';
import { Caption1, Text } from "@fluentui/react-text";
import { Card, CardPreview, CardHeader } from '@fluentui/react-card';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from "../auth/UserRoleContext";
import { UserRoleEnum } from "../models/UserRoleEnum";
import { useLocalization } from '../contexts/LocalizationContext';
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
    caption: {
        whiteSpace: 'normal',
        wordWrap: 'break-word',
    },
    cardHeader: {
        width: '250px', 
        padding: '5px',        
    },
});

const resolveAsset = (asset: string) => {
    const ASSET_URL = '/assets/';
    return `${ASSET_URL}${asset}`;
};

function Menu() {
    const classes = useStyles();
    const navigate = useNavigate();
    const { role } = useUserRole();
    const { getTranslation } = useLocalization();

    const navigateTraining = () => {
        navigate('/session');
    };

    const navigateScenarios = () => {
        navigate('/scenarios');
    };

    const navigateLastTraining = () => {
        navigate('/lastTraining');
    };

    //const navigateCoach = () => {
    //    navigate('/coach');
    //};

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
                        className={classes.cardHeader}
                        header={<Text weight="semibold">{getTranslation('MenuPracticeTitle')}</Text>}
                        description={
                            <Caption1 className={classes.caption}>{getTranslation("MenuPracticeDescription")}</Caption1>
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
                        className={classes.cardHeader}
                        header={<Text weight="semibold">{getTranslation("MenuLastTrainingTitle") }</Text>}
                        description={
                            <Caption1 className={classes.caption}>{getTranslation("MenuLastTrainingDescription") }</Caption1>
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
            {/*            className={classes.cardHeader}*/}
            {/*            header={<Text weight="semibold">Virtual AI Coach</Text>}*/}
            {/*            description={*/}
            {/*                <Caption1 className={classes.caption}>Ask anything at your Virtual AI Coach</Caption1>*/}
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
                                className={classes.cardHeader}
                                header={<Text weight="semibold">{getTranslation("MenuScenarioTitle")}</Text>}
                                description={
                                    <Caption1 className={classes.caption}>{getTranslation("MenuScenarioDescription")}</Caption1>
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
                                className={classes.cardHeader}
                                header={<Text weight="semibold">{getTranslation("MenuAgentTitle") }</Text>}
                                description={
                                    <Caption1 className={classes.caption}>{getTranslation("MenuAgentDescription") }</Caption1>
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
