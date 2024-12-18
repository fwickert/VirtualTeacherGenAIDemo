import './lastTraining.css';
import { useEffect, useState } from 'react';
import { Spinner } from "@fluentui/react-spinner";
import { Text } from "@fluentui/react-text";
import { Card, CardPreview, CardHeader } from '@fluentui/react-card';
import { useNavigate } from 'react-router-dom';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-button';
import { ILastTrainingItem } from '../../models/LastTrainingItem';
import { useUsername } from '../../auth/UserContext'; 
import { useLocalization } from '../../contexts/LocalizationContext';
import { mergeStyles } from '@fluentui/react';

const LastTraining: React.FC = () => {
    const [lastTraining, setLastTraining] = useState<ILastTrainingItem[] | null>();
    const navigate = useNavigate();    
    const userName = useUsername();
    const { getTranslation } = useLocalization();

    const navigateDashboard = (sessionId: string) => {
        navigate('/dashboard', { state: { sessionId } });
    };

    const handleBackClick = () => {
        navigate('/');
    };

    const containerClass = mergeStyles({
        marginLeft: '100px',
        marginRight: '50px',
        width: '90%',
    });

    useEffect(() => {
        getlastTraining();
    }, [userName]);

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    const contents = lastTraining === undefined ?
        <Spinner />
        : lastTraining!.length === 0 ?
            <Text>No training yet</Text>
            :
            <div className="list">
                {
                    lastTraining!.map(item =>
                        <section key={item.id}>
                            <Card orientation="horizontal" onClick={navigateDashboard.bind(this, item.id)}  >
                                <CardHeader
                                    header={<Text weight="semibold">{formatDate(item.timestamp)}</Text>}
                                />
                                <CardPreview className='horizontalCardImage'>
                                    <span className="htitle"> {item.title}</span>
                                </CardPreview>
                            </Card>
                        </section>
                    )
                }
            </div>;

    return (
        <div className={containerClass}>
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

        const response = await fetch(`/api/Session/history/${userName}`);
        const data = await response.json();
        setLastTraining(data);
    }
}

export default LastTraining;
