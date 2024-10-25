import * as React from 'react';
import { useState, useEffect } from 'react';
import { Skeleton2Rows } from '../../components/Utilities/skeleton2rows';
import MarkdownRenderer from '../Utilities/markdownRenderer';
import { HubConnection } from '@microsoft/signalr';
import { Button } from '@fluentui/react-components';
import { DialogPrompt } from '../Utilities/DialogPrompt';
interface DashboardFeatureResultProps {
    data: any;
    infoType: string;
    loading: boolean;
    connection: HubConnection;
    conversation: string;
}


const DashboardFeatureResult: React.FC<DashboardFeatureResultProps> = ({ data, infoType, loading,conversation, connection }) => {
    const [content, setContent] = useState(data?.content || '');
    const [isLoading, setIsLoading] = useState(loading);
    

    useEffect(() => {
        if (connection) {            
            connection.on(infoType, (updatedData: any) => {                
                setIsLoading(false);
                setContent(updatedData);                
            });

            return () => {
                connection.off(infoType);
            };
        }
        else {console.log('Connection not found') }
    }, [connection]);

    const callApiForFeature = async (feature: string, item: any) => {
        setIsLoading(true); 
        try {
            const body = {
                id: item.id,
                chatId: item.chatId,
                conversation: conversation,
                connectionId: connection.connectionId!,
                title: feature,
                prompt: feature
            }
            console.log(`Calling API for ${feature} with body:`, body);
            const response = await fetch(`/api/dashboard/${feature}`, {
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

    return data ? (
        <div role="tabpanel" aria-labelledby={data.infoType} className="tabpanel">
            <Button onClick={() => callApiForFeature(infoType, data)}>Generate {infoType}</Button>
            <DialogPrompt title={infoType } prompt={infoType} />
            <section className="frame">
                <span id={data.infoType}>
                    {isLoading ? <Skeleton2Rows /> : <MarkdownRenderer markdown={content} />}
                </span>
            </section>
        </div>
    ) :
        (
            <section className="frame">
                <span id={infoType}>
                    Not Generated Yet
                </span>
            </section>
        )



};

export { DashboardFeatureResult }