import './sessionList.css';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardPreview, CardFooter } from '@fluentui/react-card';
import { Title2, Body2 } from '@fluentui/react-text';
import { Button } from '@fluentui/react-button';
import { Spinner } from '@fluentui/react-spinner';
import { makeStyles } from '@fluentui/react-components';
import { AddCircleRegular, PeopleCommunityFilled, PlayRegular } from '@fluentui/react-icons';
import { tokens } from '@fluentui/tokens';
import { useNavigate } from 'react-router-dom';
import { SessionItem } from '../../models/SessionItem';
import { useUsername } from '../../auth/UserContext';
import { useLocalization } from '../../contexts/LocalizationContext';
import { SessionService } from '../../services/SessionService';

interface SessionListProps {
    onSessionStart: (session: SessionItem) => void;
}

const useStyles = makeStyles({
    customPreview: {
        paddingLeft: '10px',
    },
    customCard: {
        minWidth: '400px',
        maxWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    iconGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px',
    },
    iconItem: {
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'center',
        marginTop: '20px',
    },
    icon: {
        fontSize: '40px',
    },
    iconText: {
        marginTop: '5px',
    },
    grayColor: {
        color: tokens.colorNeutralForegroundDisabled,
    },
    systemColor: {
        color: tokens.colorPaletteLilacForeground2,
    },
    teacherColor: {
        color: tokens.colorPaletteLightGreenForeground1,
    },
    otherColor: {
        color: tokens.colorBrandForeground1,
    },
    centerContainer: {
        display: 'flex',
        justifyContent: 'left',
        marginTop: '10px',
    },
    buttonWithIcon: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonIcon: {
        fontSize: '48px',
        marginBottom: '5px',
    },
    resumeButton: {
        marginLeft: 'auto',
        zIndex: 1, // Ensure the button is above other elements
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: 'auto',
        position: 'relative', // Ensure z-index works
    },
});

const SessionList: React.FC<SessionListProps> = ({ onSessionStart }) => {
    const navigate = useNavigate();
    const classes = useStyles();
    const userName = useUsername();
    const [sessions, setSessions] = useState<SessionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getTranslation } = useLocalization();

    useEffect(() => {
        SessionService.getIncompleteSessions(userName)
            .then(response => {
                const parsedData = response.data.map((session: any) => ({
                    ...session,
                    timestamp: new Date(session.timestamp)
                }));
                setSessions(parsedData);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching sessions:', error);
                setIsLoading(false);
            });
    }, [userName]);

    const handleResume = async (session: SessionItem) => {
        if (onSessionStart) {
            onSessionStart(session);
        }
    };

    const handleAddSession = () => {
        navigate('/scenarios');
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB');
    };

    return (
        <div className={classes.centerContainer}>
            {isLoading && <Spinner label={getTranslation("loading")} />}
            {!isLoading && (
                <div className="session-cards-grid">
                    <Button className={classes.buttonWithIcon} onClick={handleAddSession}>
                        <AddCircleRegular className={classes.buttonIcon} />
                        {getTranslation("NewSession")}
                    </Button>
                    {sessions.map(session => {
                        const rolePlayAgent = session.agents.find(agent => agent.type === 'rolePlay');
                        return (
                            <Card key={session.id} className={`${classes.customCard} card`}>
                                <CardHeader
                                    header={<Title2>{session.title}</Title2>}
                                    action={<PeopleCommunityFilled className={classes.icon} />}
                                />
                                <CardPreview className={classes.customPreview}>
                                    <Body2>Role: {rolePlayAgent ? rolePlayAgent.name : 'N/A'}</Body2>
                                    <Body2>{formatDate(session.timestamp!)}</Body2>
                                </CardPreview>
                                <CardFooter className={classes.cardFooter}>
                                    <Button
                                        appearance='primary'
                                        className={classes.resumeButton}
                                        icon={<PlayRegular />}
                                        onClick={() => handleResume(session)}>
                                        {getTranslation("Resume")}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SessionList;
