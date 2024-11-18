import './lastTraining.css';
import { useEffect, useState } from 'react';
import { Spinner } from "@fluentui/react-spinner";
import { Text } from "@fluentui/react-text";
import { Card, CardPreview, CardHeader } from '@fluentui/react-card';
import { useNavigate } from 'react-router-dom';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-button';
import { ILastTrainingItem } from '../../models/LastTrainingItem';

const LastTraining: React.FC = () => {
    const [lastTraining, setLastTraining] = useState<ILastTrainingItem[] | null>();
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string>('');

    const navigateDashboard = (sessionId: string) => {
        navigate('/dashboard', { state: { sessionId } });
    };

    const navigatHome = () => {
        navigate('/');
    };

    useEffect(() => {
        setUserId('Anonymous');
    }, []);

    useEffect(() => {
        getlastTraining();
    }, [userId]);

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
        <div>
            <Button size="large" appearance="transparent" onClick={navigatHome} icon={<ArrowCircleLeft48Filled />} />
            <h1 className="title">Last Training </h1>
            {contents}
        </div>
    );

    async function getlastTraining() {
        if (userId === '') {
            return;
        }

        const response = await fetch(`/api/Session/history/${userId}`);
        const data = await response.json();
        setLastTraining(data);
    }
}

export default LastTraining;
