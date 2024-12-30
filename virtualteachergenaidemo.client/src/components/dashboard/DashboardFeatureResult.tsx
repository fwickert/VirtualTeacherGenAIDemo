import * as React from 'react';
import { useState, useEffect } from 'react';
import { Skeleton2Rows } from '../../components/Utilities/skeleton2rows';
import MarkdownRenderer from '../Utilities/markdownRenderer';
import { HubConnection } from '@microsoft/signalr';
//import { Button } from '@fluentui/react-button';
//import { DialogPrompt } from '../Utilities/DialogPrompt';
import DashboardService from '../../services/DashboardService';
import { useLocalization } from '../../contexts/LocalizationContext';

interface DashboardFeatureResultProps {    
    data: any;
    infoType: string;
    loading: boolean;
    connection: HubConnection | null;    
}

const DashboardFeatureResult: React.FC<DashboardFeatureResultProps> = ({ data, infoType, loading, connection}) => {
    const [content, setContent] = useState(data?.content || '');
    const [isLoading, setIsLoading] = useState(loading);
    const { getTranslation } = useLocalization();

    useEffect(() => {
        if (connection) {
            setupConnectionHandlers(connection);

            return () => {
                removeConnectionHandlers(connection);
            };
        } else {
            console.log('Connection not found');
        }
    }, [connection]);

    const removeConnectionHandlers = (connection: HubConnection) => {
        connection.off(infoType);
    };

    const setupConnectionHandlers = (connection: HubConnection) => {
        removeConnectionHandlers(connection);

        connection.on(infoType, (updatedData: any) => {
            setIsLoading(false);
            setContent(updatedData.content);
        });
    };

    return (
        <div role="tabpanel" aria-labelledby={infoType} className="tabpanel">
            {/*<Button onClick={() => callApiForFeature(infoType, data)}>{getTranslation("GenerateButton")} {infoType}</Button>*/}
            {/*<DialogPrompt title={infoType} />*/}
            <section className="frame">
                <span id={infoType}>
                    {isLoading ? <Skeleton2Rows /> :
                        content ? <MarkdownRenderer markdown={content} /> : <span>{getTranslation("NoGenerateYet")}</span>
                    }
                </span>
            </section>
        </div>
    );
};

export { DashboardFeatureResult };

