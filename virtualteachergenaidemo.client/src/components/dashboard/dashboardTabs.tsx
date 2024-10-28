import './dashboardTabs.css';
import React, { useEffect, useState } from 'react';
import { Tab, TabList } from '@fluentui/react-components';
import { Skeleton3Rows } from '../../components/Utilities/skeleton3rows';
import * as SignalR from '@microsoft/signalr';
import { DashboardFeatureResult } from './DashboardFeatureResult';

interface DashboardTabsProps {
    chatId: string;
    conversation: string;
}

const hubUrl = process.env.HUB_URL;

let connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
    .withUrl(hubUrl!)
    .build();

connection.start();

const DashboardTabs: React.FC<DashboardTabsProps> = ({ chatId, conversation }) => {
    const [selectedValue, setSelectedValue] = useState<string>("Summary");
    const [dashboardData, setDashboardData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
   

    useEffect(() => {
        console.log('Fetching dashboard data for chatId:', chatId);
        fetchDashboardData(chatId);
    }, [chatId]);

    const fetchDashboardData = async (chatId: string) => {
        try {
            const response = await fetch('/api/dashboard?chatId=' + chatId);
            if (!response.ok) {
                console.error('Failed to fetch dashboard data:', response.statusText);
                return;
            }
            const data = await response.json();
            console.log('Fetched dashboard data:', data);
            setDashboardData(data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onTabSelect = (_event: any, data: any) => {
        console.log('Selected tab:', data.value);
        setSelectedValue(data.value);
    };

   

    const getTabContent = (infoType: string, _title: string) => {
        const item = dashboardData.find((data: any) => data.infoType === infoType);
        
        return (
            <div role="tabpanel" aria-labelledby={infoType} className="tabpanel">               
                <DashboardFeatureResult
                    chatId={chatId}
                    data={item}
                    loading={loading}
                    infoType={infoType}
                    connection={connection}
                    conversation={conversation}
                ></DashboardFeatureResult>
            </div>
        )
    };

    return (
        <div>
            <TabList className="tab" selectedValue={selectedValue} onTabSelect={onTabSelect}>
                <Tab value="Summary">Summary</Tab>
                <Tab value="Advice">Advice</Tab>
                <Tab value="Example">Example</Tab>
                <Tab value="Evaluation">Evaluation</Tab>
            </TabList>
            {loading ? (
                <Skeleton3Rows />
            ) : (
                <div>
                    {selectedValue === "Summary" && (
                        <>
                            <div>{getTabContent("Summary", "Summary")}</div>
                            <div>{getTabContent("Products", "Products")}</div>
                            <div>{getTabContent("Keywords", "Keywords")}</div>
                        </>
                    )}
                    {selectedValue === "Advice" && (
                        <div>{getTabContent("Advice", "Advice")}</div>
                    )}
                    {selectedValue === "Example" && (
                        <div>{getTabContent("Example", "Example")}</div>
                    )}
                    {selectedValue === "Evaluation" && (
                        <div>{getTabContent("Evaluation", "Evaluation")}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardTabs;
