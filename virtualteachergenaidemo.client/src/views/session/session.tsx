import React from 'react';
import SessionList from '../../components/session/sessionList';
import { mergeStyles } from '@fluentui/react';
import { Button } from '@fluentui/react-button';
import { useNavigate } from 'react-router-dom';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';
import { SessionItem } from '../../models/SessionItem';
import { useLocalization } from '../../contexts/LocalizationContext';

const SessionPage: React.FC = () => {
    const navigate = useNavigate();
    const { getTranslation } = useLocalization();

    const handleBackClick = () => {
        navigate('/');
    };

    const handleSessionStart = async (session: SessionItem) => {
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
                    <h1>{getTranslation("ViewSessionTitle")}</h1>
                    <p className="intro">
                        {getTranslation("ViewSessionDescription")}
                    </p>
                </section>
            </div>
            <SessionList onSessionStart={handleSessionStart} />
        </div>
    );
};

export default SessionPage;
