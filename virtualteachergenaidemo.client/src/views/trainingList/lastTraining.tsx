import './lastTraining.css';
import { useEffect, useState } from 'react';
import { Spinner, Text } from "@fluentui/react-components";
import { Card, CardPreview, CardHeader } from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';


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

    useEffect(() => {
        getlastTraining();
    }, []);




    const contents = lastTraining === undefined ? 
        <Spinner />
    
        :
        <div>
            <div>
                {
                    lastTraining!.map(item =>
                        <section key={item.chatId}>
                            <Card orientation="horizontal" onClick={navigateDashboard.bind(this, item.chatId) }  >
                                <CardPreview className='horizontalCardImage'>
                                    {item.title} - { item.chatId }
                                </CardPreview>

                                <CardHeader
                                    header={<Text weight="semibold">{item.timestamp}</Text>}
                                />
                            </Card>
                        </section>


                    )
                }
            </div>
        </div>;

    return (
        <div>
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