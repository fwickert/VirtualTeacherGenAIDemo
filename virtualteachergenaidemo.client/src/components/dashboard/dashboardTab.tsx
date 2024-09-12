import './dashboardTab.css';
import * as React from 'react';
import { useEffect } from 'react';
import { makeStyles, Tab, TabList } from '@fluentui/react-components';
import type { TabValue, SelectTabData, SelectTabEvent, } from "@fluentui/react-components";
import MarkdownRenderer from '../Utilities/markdownRenderer';
import { DialogPrompt } from '../Utilities/DialogPrompt';
import { ButtonGenAI } from './buttonGenAI';
import { useDashboardContextState } from '../sharedContext/dashboardContextState';
import type { DashboardState } from '../sharedContext/dashboardContextState';
import { v4 as uuidv4 } from 'uuid';
import { Row } from '../Utilities/skeleton';


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
    const { dashboardState, setDashboardState } = useDashboardContextState();

    const styles = useStyles();


    useEffect(() => {
        getDashboard(props.chatId);
    }, []);



    const [selectedValue, setSelectedValue] =
        React.useState<TabValue>("Summary");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    const Summary = React.memo(() => (

        <div role="tabpanel" aria-labelledby="Summary" className="tabpanel">
            <ButtonGenAI {...dashboardState.items.find(q => q.infoType == "Summary")} />
            <DialogPrompt title="Summary prompt" prompt="Summarize" />
            <section className="frame">
                <span id="summary"> {dashboardState.items.find(q => q.infoType == "Summary")?.content!}</span>
            </section>
            <ButtonGenAI {...dashboardState.items.find(q => q.infoType == "Products")} />
            <DialogPrompt title="Products prompt" prompt="Products" />
            <section className="frame">
                <span id="products"> <MarkdownRenderer markdown={dashboardState.items.find(q => q.infoType == "Products")?.content!} /></span>
            </section>
            <ButtonGenAI {...dashboardState.items.find(q => q.infoType == "Keywords")} />
            <DialogPrompt title="Keywords prompt" prompt="Keywords" />
            <section className="frame">
                <span id="keywords"> <MarkdownRenderer markdown={dashboardState.items.find(q => q.infoType == "Keywords")?.content!} /></span>
            </section>
        </div>
    ));

    const Advice = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Advice" className="tabpanel">
            <ButtonGenAI {...dashboardState.items.find(q => q.infoType == "Advice")} />
            <DialogPrompt title="Advice prompt" prompt="Advice" />
            <section className="frame">
                <span id="advice"> <MarkdownRenderer markdown={dashboardState.items.find(q => q.infoType == "Advice")?.content!} /></span>
            </section>
        </div>
    ));

    const Example = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Example" className="tabpanel">
            <ButtonGenAI {...dashboardState.items.find(q => q.infoType == "Example")} />
            <DialogPrompt title="Example prompt" prompt="Example" />
            <section className="frame">
                <span id="example"> <MarkdownRenderer markdown={dashboardState.items.find(q => q.infoType == "Example")?.content!} /></span>
            </section>
        </div>
    ));

    const Evaluation = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Evaluation" className="tabpanel">
            <ButtonGenAI {...dashboardState.items.find(q => q.infoType == "Evaluation")} />
            <DialogPrompt title="Evaluation prompt" prompt="Evaluation" />
            <section className="frame">
                <span id="evaluation"> <MarkdownRenderer markdown={dashboardState.items.find(q => q.infoType == "Evaluation")?.content!} /></span>
            </section>
        </div>
    ));



    return (
        //dashboardState.conversation === "" ?
        ////1 === 1 ?
        //    //<Spinner />              
        //    <Row />
        //    :
        <div>
            {/*<div>{dashboardState.conversation}</div>*/}
            <TabList className="tab" selectedValue={selectedValue} onTabSelect={onTabSelect}>
                <Tab value="Summary">Summary</Tab>
                <Tab value="Advice">Advice</Tab>
                <Tab value="Example">Example</Tab>
                <Tab value="Evaluation">Evaluation</Tab>
            </TabList>
            {dashboardState.conversation === "" ?
                <Row />
                :
                <div className={styles.panels}>
                    {selectedValue === "Summary" && <Summary />}
                    {selectedValue === "Advice" && <Advice />}
                    {selectedValue === "Example" && <Example />}
                    {selectedValue === "Evaluation" && <Evaluation />}
                </div>
            }

        </div>
    );

    async function getDashboard(chatid: string) {
        const defaultData: DashboardState = {
            items: [
                { infoType: "Summary", title: "Get Summary", prompt: "summary", content: "", chatId: props.chatId, id: uuidv4() },
                { infoType: "Products", title: "Get Products", prompt: "products", content: "", chatId: props.chatId, id: uuidv4() },
                { infoType: "Keywords", title: "Get Keywords", prompt: "keywords", content: "", chatId: props.chatId, id: uuidv4() },
                { infoType: "Advice", title: "Get Advice", prompt: "advice", content: "", chatId: props.chatId, id: uuidv4() },
                { infoType: "Example", title: "Get Example", prompt: "example", content: "", chatId: props.chatId, id: uuidv4() },
                { infoType: "Evaluation", title: "Get Evaluation", prompt: "evaluation", content: "", chatId: props.chatId, id: uuidv4() }
            ],
            conversation: dashboardState.conversation,
            connectionId: ""

        };


        const response = await fetch('/api/dashboard?chatId=' + chatid);
        const data = await response.json();
        const updatedData = {
            ...defaultData,
            items: defaultData.items.map(defaultItem => {
                const fetchedItem = data.find((item: any) => item.infoType === defaultItem.infoType);
                return fetchedItem ? { ...defaultItem, ...fetchedItem } : defaultItem;
            })
        };
        setDashboardState(updatedData);
    }
};