import './training.css';
import React from 'react';
import { Text } from "@fluentui/react-components";
import ChatWindow from '../components/chatWindow';

function Training() {
    return (
        <div>
            <Text align="center">
                <section className="intro">
                    <h2>Virtual Assistant Teacher</h2>
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