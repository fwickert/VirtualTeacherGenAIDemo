import './lastTraining.css';
import { useEffect, useState } from 'react';
import { Spinner } from "@fluentui/react-spinner";
import { Text } from "@fluentui/react-text";
import { Card, CardPreview, CardHeader, CardFooter } from '@fluentui/react-card';
import { useNavigate } from 'react-router-dom';
import { ArrowCircleLeft48Filled, EditRegular } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-button';
import { useUsername } from '../../auth/UserContext';
import { useLocalization } from '../../contexts/LocalizationContext';
import { SessionService } from '../../services/SessionService';
import { SessionItem } from '../../models/SessionItem';
import { makeStyles } from '@fluentui/react-components';
import { NotepadRegular, BoxRegular, TagRegular, BotFilled } from '@fluentui/react-icons';
import { HubConnection } from '@microsoft/signalr';
import { getHubConnection } from '../../services/signalR';

const useStyles = makeStyles({
    customPreview: {
        paddingLeft: '10px', 
        height: '25px',
    },
    customCard: {
        minWidth: '300px',
        maxWidth: '300px',
        minHeight: '200px',
        maxHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: 'auto',
    },
    editButton: {
        marginLeft: 'auto',
        zIndex: 1,
    },
    htitle: {
        fontSize: '15px',
        lineHeight: 'var(--lineHeightBase400)',
        fontWeight: 'bold',
    },
    agentInfo: {
        marginTop: '10px',
    },
    container: {
        marginLeft: '100px',
        marginRight: '50px',
        width: '90%',
    },
    deactivatedIcon: {
        color: '#000000', // Deactivated color
    },
    activatedIcon: {
        color: '#000000', // Activated color
    },
});

const LastTraining: React.FC = () => {
    const classes = useStyles();
    const [lastTraining, setLastTraining] = useState<SessionItem[] | undefined>();
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const navigate = useNavigate();
    const userName = useUsername();
    const { getTranslation } = useLocalization();
    const [noteActivated, setNoteActivated] = useState<boolean>(false);
    const [tagActivated, setTagActivated] = useState<boolean>(false);
    const [boxActivated, setBoxActivated] = useState<boolean>(false);
    const [botActivated, setBotActivated] = useState<boolean>(false);

    const navigateDashboard = (sessionId: string, scenarioTitle: string, roleAgent: string) => {
        navigate('/dashboard', { state: { sessionId, scenarioTitle, roleAgent } });
    };

    const handleBackClick = () => {
        navigate('/');
    };

    useEffect(() => {
        getlastTraining();
    }, [userName]);

    useEffect(() => {
        const setupConnection = async () => {
            try {
                const newConnection = await getHubConnection();
                setConnection(newConnection);
                setupConnectionHandlers(newConnection);
            } catch (error) {
                console.error('Connection failed: ', error);
            }
        };

        setupConnection();
    }, []);

    const removeConnectionHandlers = (connection: HubConnection) => {
        connection.off('ActivateNoteIcon');
        connection.off('ActivateTagIcon');
        connection.off('ActivateBoxIcon');
        connection.off('ActivateBotIcon');
    };

    const setupConnectionHandlers = (connection: HubConnection) => {
        removeConnectionHandlers(connection);

        connection.on('ActivateNoteIcon', () => {
            setNoteActivated(true);
        });

        connection.on('ActivateTagIcon', () => {
            setTagActivated(true);
        });

        connection.on('ActivateBoxIcon', () => {
            setBoxActivated(true);
        });

        connection.on('ActivateBotIcon', () => {
            setBotActivated(true);
        });

        connection.onclose(() => {
            console.log('Connection closed');
        });
    };

    useEffect(() => {
        if (connection && connection.state === 'Disconnected') {
            connection.start()
                .then(() => {
                    setupConnectionHandlers(connection);
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const formatDate = (timestamp: Date | undefined) => {
        if (!timestamp) {
            return '';
        }
        const date = new Date(timestamp);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const contents = lastTraining === undefined ?
        <Spinner />
        : lastTraining!.length === 0 ?
            <Text>{getTranslation("NoTrainingYet")}</Text>
            :
            <div className="list">
                {
                    lastTraining!.map(item => {
                        const rolePlayAgent = item.agents.find(agent => agent.type === 'rolePlay');
                        return (
                            <Card key={item.id} className={`${classes.customCard} card`} >
                                <CardHeader
                                    header={<Text className={classes.htitle}>{formatDate(item.timestamp)}</Text>}
                                />
                                <CardPreview className={classes.customPreview}>
                                    <div className={classes.htitle}>Scenario: {item.scenarioName}</div>
                                    <div>{getTranslation("CompletedDate")} : {formatDate(item.completedTimestamp) }</div>
                                    {rolePlayAgent && (
                                        <div className={classes.agentInfo}>
                                            <Text>Role: {rolePlayAgent.name}</Text>
                                        </div>
                                    )}
                                </CardPreview>
                                <CardFooter className={classes.cardFooter}>
                                    <NotepadRegular className={noteActivated ? classes.activatedIcon : classes.deactivatedIcon} />
                                    <TagRegular className={tagActivated ? classes.activatedIcon : classes.deactivatedIcon} />
                                    <BoxRegular className={boxActivated ? classes.activatedIcon : classes.deactivatedIcon} />
                                    <BotFilled className={botActivated ? classes.activatedIcon : classes.deactivatedIcon} />
                                    <Button
                                        icon={<EditRegular />}
                                        className={classes.editButton}
                                        onClick={() => navigateDashboard(item.id, item.scenarioName, rolePlayAgent ? rolePlayAgent.name : '')}
                                    >
                                        {getTranslation("ViewDetails")}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })
                }
            </div>;

    return (
        <div className={classes.container}>
            <div className="header">
                <section className="intro">
                    <div className="back">
                        <Button size="large" appearance="transparent" onClick={handleBackClick} icon={<ArrowCircleLeft48Filled />} />
                    </div>
                    <h1>{getTranslation("ViewLastTrainingTitle")}</h1>
                    <p className="intro">
                        {getTranslation("ViewLastTrainingDescription")}
                    </p>
                </section>
            </div>
            {contents}
        </div>
    );

    async function getlastTraining() {
        if (userName === '') {
            return;
        }

        try {
            const response = await SessionService.getSessionHistory(userName);
            setLastTraining(response.data);
        } catch (error) {
            console.error('Error fetching last training sessions:', error);
        }
    }
}

export default LastTraining;
