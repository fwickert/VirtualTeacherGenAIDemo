import './dashboardTab.css';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Spinner } from '@fluentui/react-components';
import { makeStyles, Tab, TabList } from '@fluentui/react-components';
import type { TabValue, SelectTabData, SelectTabEvent, } from "@fluentui/react-components";
import MarkdownRenderer from '../Utilities/markdownRenderer';
import { DialogPrompt } from '../Utilities/DialogPrompt';
import { ButtonGenAI } from './buttonGenAI';
import type { IDashboardRequestProps } from './buttonGenAI';

interface IDashboard {
    id: string;
    chatId: string;
    infoType: string;
    content: string;
}

const useStyles = makeStyles({
    panels: {
        padding: "0 10px",
        "& th": {
            textAlign: "left",
            padding: "0 30px 0 0",
        },
    },
});

export const DashboardTab = (props: any) => {
    const [dashboard, setDashboard] = useState<IDashboard[]>();
    const styles = useStyles();


    useEffect(() => {
        getDashboard(props.chatId);
    }, []);

    const [selectedValue, setSelectedValue] =
        React.useState<TabValue>("Summary");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    const summary = dashboard?.find(q => q.infoType == "Summary");
    const products = dashboard?.find(q => q.infoType == "Products");
    const keywords = dashboard?.find(q => q.infoType == "Keywords");
    const advice = dashboard?.find(q => q.infoType == "Advice");
    const example = dashboard?.find(q => q.infoType == "Example");
    const evaluation = dashboard?.find(q => q.infoType == "Evaluation");

    const dashboardRequest: IDashboardRequestProps = {
        id: "",
        chatId: "",
        conversation: "",
        connectionId: "test",
        title:""
    };


    const Summary = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Summary" className="tabpanel">
            <ButtonGenAI {...dashboardRequest} title="Get Summary" chatId={props.chatId} id={summary!.id} prompt="summary" />
            <DialogPrompt title="Summary prompt" prompt="Summarize" />
            <section className="frame">
                <span id="summary"> {summary!.content}</span>                
            </section>
            <ButtonGenAI {...dashboardRequest} title="Get Products" chatId={props.chatId} id={products!.id} prompt="products" />
            <DialogPrompt title="Products prompt" prompt="Products" />
            <section className="frame">
                <span id="products"> <MarkdownRenderer markdown={products!.content} /></span>
            </section>
            <ButtonGenAI {...dashboardRequest} title="Get Keywords" chatId={props.chatId} id={keywords!.id} prompt="keywords" />
            <DialogPrompt title="Keywords prompt" prompt="Keywords" />
            <section className="frame">
                <span id="keywords"> <MarkdownRenderer markdown={keywords!.content} /></span>
            </section>
        </div>
    ));

    const Advice = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Advice" className="tabpanel">
            <ButtonGenAI {...dashboardRequest} title="Get Advice" chatId={props.chatId!} id={advice?.id!} prompt="advice" />
            <DialogPrompt title="Advice prompt" prompt="Advice" />
            <section className="frame">
                <span id="advice"> <MarkdownRenderer markdown={advice?.content!} /></span>
            </section>
        </div>
    ));

    const Example = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Example" className="tabpanel">
            <ButtonGenAI {...dashboardRequest} title="Get Example" chatId={props.chatId!} id={example?.id!} prompt="example" />
            <DialogPrompt title="Example prompt" prompt="Example" />
            <section className="frame">
                <span id="example"> <MarkdownRenderer markdown={example?.content!} /></span>
            </section>
        </div>
    ));

    const Evaluation = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Evaluation" className="tabpanel">
            <ButtonGenAI {...dashboardRequest} title="Get Evaluation" chatId={props.chatId!} id={evaluation?.id!} prompt="evaluation" />
            <DialogPrompt title="Evaluation prompt" prompt="Evaluation" />
            <section className="frame">
                <span id="evaluation"> <MarkdownRenderer markdown={evaluation?.content!} /></span>
            </section>
        </div>
    ));



    return (
        dashboard === undefined ?
            <Spinner />
            :
            <div>

                <TabList className="tab" selectedValue={selectedValue} onTabSelect={onTabSelect}>
                    <Tab value="Summary">Summary</Tab>
                    <Tab value="Advice">Advice</Tab>
                    <Tab value="Example">Example</Tab>
                    <Tab value="Evaluation">Evaluation</Tab>
                </TabList>
                <div className={styles.panels}>
                    {selectedValue === "Summary" && <Summary />}
                    {selectedValue === "Advice" && <Advice />}
                    {selectedValue === "Example" && <Example />}
                    {selectedValue === "Evaluation" && <Evaluation />}
                </div>


            </div>
    );

    async function getDashboard(chatid: string) {
        const response = await fetch('/api/dashboard?chatId=' + chatid);
        const data = await response.json();
        setDashboard(data);
    }
};