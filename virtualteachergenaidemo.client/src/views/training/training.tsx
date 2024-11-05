import './training.css'
import { Text } from "@fluentui/react-text"
import { useNavigate } from 'react-router-dom';
import ChatWindow from '../../components/chat/chatWindow'
import { Button } from '@fluentui/react-button';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';

function Training() {
    
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div>
            <Text align="center">
                <section className="intro">
                    <div className="back">
                        <Button size="large" appearance="transparent" onClick={handleBackClick} icon={<ArrowCircleLeft48Filled />} />
                    </div>
                    <h1 className="title">Virtual Assistant Teacher</h1>
                    <p className="intro">
                        Virtual Assistant Teacher is a tool that trains you to sell with an AI customer.<br /> It simulates a real scenario, listens and evaluates you, and gives you feedback and tips. It helps you to boost your confidence and efficiency in sales.
                    </p>
                </section>
            </Text>

            <ChatWindow />
            
        </div>
    );
};

export default Training;