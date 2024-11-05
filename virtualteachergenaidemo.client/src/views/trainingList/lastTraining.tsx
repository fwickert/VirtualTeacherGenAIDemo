import './lastTraining.css';
import { useEffect, useState } from 'react';
import { Spinner } from "@fluentui/react-spinner";
import { Text } from "@fluentui/react-text";
import { Card, CardPreview, CardHeader } from '@fluentui/react-card';
import { useNavigate } from 'react-router-dom';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-button';

interface ILastTraining {
    id: string;
    chatId: string;
    title: string;
    timestamp: string;
}

const LastTraining: React.FC = () => {
    const [lastTraining, setLastTraining] = useState<ILastTraining[] | null>();
    const navigate = useNavigate();

    const navigateDashboard = (chatId: string) => {
        navigate('/dashboard', { state: { chatId } });
    };

    const navigatHome = () => {
        navigate('/');
    };

    useEffect(() => {
        getlastTraining();
    }, []);

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };


    const contents = lastTraining === undefined ? 
        <Spinner />    
        :
        <div className="list">
            
                {
                    lastTraining!.map(item =>
                        <section key={item.chatId}>
                            <Card orientation="horizontal" onClick={navigateDashboard.bind(this, item.chatId)}  >
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
        const response = await fetch('/api/chat/history');
        const data = await response.json();
        setLastTraining(data);
    }
}

export default LastTraining;