import * as React from 'react';
import { useState, useEffect } from 'react';
import { Skeleton2Rows } from '../../components/Utilities/skeleton2rows';
import MarkdownRenderer from '../Utilities/markdownRenderer';
import { HubConnection } from '@microsoft/signalr';
import { Button } from '@fluentui/react-button';
import { ArrowSyncFilled } from '@fluentui/react-icons';
import DashboardService from '../../services/DashboardService';
import { useLocalization } from '../../contexts/LocalizationContext';
import { DashboardRequest } from '../../models/Request/DashboardRequest';
import { makeStyles } from '@fluentui/react-components';

interface DashboardFeatureResultProps {
    data: any;
    infoType: string;
    loading: boolean;
    connection: HubConnection | null;
    sessionId: string;
    userName: string;
    conversation: string;
}
const useStyles = makeStyles({
    button: {
        border: 'none',        
        position: 'absolute',
        top: '8px',
        right: '8px'        
    },
    container: {
        position: 'relative'
    }
});
const DashboardFeatureResult: React.FC<DashboardFeatureResultProps> = ({ data, infoType, loading, connection, sessionId, userName, conversation }) => {
    const [content, setContent] = useState(data?.content || '');
    const [isLoading, setIsLoading] = useState(loading);
    const { getTranslation } = useLocalization();
    const styles = useStyles();

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

    const handleRefreshClick = async () => {
        setIsLoading(true);
        try {
            const body: DashboardRequest = {
                sessionId: sessionId,
                id: infoType,
                conversation: conversation,
                connectionId: connection?.connectionId || '',
                title: '' // Add the actual title if needed
            };
            const updatedData = await DashboardService.postFeature(infoType, sessionId, userName, body, true);
            setContent(updatedData.content);            
        } catch (error) {
            console.error('Error refreshing data:', error);
            setIsLoading(false);
        }
    };

    return (
        <div role="tabpanel" aria-labelledby={infoType} className="tabpanel">
            <section className={`frame ${styles.container}`}>
                <span id={infoType}>
                    <Button
                        icon={<ArrowSyncFilled style={{ fontSize: '16px' }} />} 
                        onClick={handleRefreshClick} className={styles.button} />
                    {isLoading ? <Skeleton2Rows /> :
                        content ? <MarkdownRenderer markdown={content} /> : <span>{getTranslation("NoGenerateYet")}</span>
                    }
                </span>
            </section>
        </div>
    );
};

export { DashboardFeatureResult };
