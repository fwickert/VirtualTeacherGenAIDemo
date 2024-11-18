import React from 'react';
import SessionList from '../../components/session/sessionList';
import { mergeStyles } from '@fluentui/react';
import { Button } from '@fluentui/react-button';
import { useNavigate } from 'react-router-dom';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';
import { ISessionItem } from '../../models/SessionItem';

const SessionPage: React.FC = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };

    const handleSessionStart = async (session: ISessionItem) => {            
        navigate('/training', { state: { session } });
    };

    const containerClass = mergeStyles({
        marginLeft: '100px',
        marginRight: '50px',
        width: '90%',
    });

    return (
        <div className={containerClass}>
            <div className="header">
                <section className="intro">
                    <div className="back">
                        <Button size="large" appearance="transparent" onClick={handleBackClick} icon={<ArrowCircleLeft48Filled />} />
                    </div>
                    <h1>Your current Sessions</h1>
                    <p className="intro">
                        A scenario allows the user to choose a scenario to start a simulation. It includes the agents used in the simulation.
                        Your personal dashboard will display all information about a simulation. You can review the discussion, the summary, advice, and feedback.
                    </p>
                </section>
            </div>
            <SessionList onSessionStart={handleSessionStart} />
        </div>
    );
};

export default SessionPage;
