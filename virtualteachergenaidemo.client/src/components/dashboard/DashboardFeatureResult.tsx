import * as React from 'react';
import { useState, useEffect } from 'react';
import { Skeleton2Rows } from '../../components/Utilities/skeleton2rows';
import MarkdownRenderer from '../Utilities/markdownRenderer';
import { HubConnection } from '@microsoft/signalr';
import { Button } from '@fluentui/react-button';
import { DialogPrompt } from '../Utilities/DialogPrompt';
interface DashboardFeatureResultProps {
    sessionId:string
    data: any;
    infoType: string;
    loading: boolean;
    connection: HubConnection | null;
    conversation: string;
    userName: string;
}


const DashboardFeatureResult: React.FC<DashboardFeatureResultProps> = ({ sessionId, data, infoType, loading, conversation, connection, userName }) => {
    const [content, setContent] = useState(data?.content || '');
    const [isLoading, setIsLoading] = useState(loading);


    useEffect(() => {

        if (connection) {
            
            connection.on(infoType, (updatedData: any) => {
                setIsLoading(false);
                
                setContent(updatedData.content);
            });

            return () => {
                connection.off(infoType);
            };
        }
        else { console.log('Connection not found') }
    }, [connection]);

    const callApiForFeature = async (feature: string, item: any) => {
        setIsLoading(true);
        try {
            const body = {
                id: item == undefined ? "" :  item.id,
                sessionId: sessionId,
                conversation: conversation,
                connectionId: connection?.connectionId,
                title: feature,
                prompt: feature
            }
            console.log(`Calling API for ${feature} with body:`, body);
            const response = await fetch(`/api/dashboard/${feature}?sessionId=${sessionId}&userName=${userName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                console.error(`Failed to call API for ${feature}:`, response.statusText);
                setContent('Failed to generate content');
                setIsLoading(false);
                return;
            }
        } catch (error) {
            console.error(`Error calling API for ${feature}:`, error);
            setContent('Failed to generate content');
            setIsLoading(false);
        } finally {

        }
    };

    return (
        <div role="tabpanel" aria-labelledby={infoType} className="tabpanel">
            <Button onClick={() => callApiForFeature(infoType,data)}>Generate {infoType}</Button>
            <DialogPrompt title={infoType} />
            <section className="frame">
                <span id={infoType}>
                    {isLoading ? <Skeleton2Rows /> :
                        content ? <MarkdownRenderer markdown={content} /> : <span>No Generate Yet</span>
                            
                    }
                </span>
            </section>
        </div>
    );
};

export { DashboardFeatureResult }