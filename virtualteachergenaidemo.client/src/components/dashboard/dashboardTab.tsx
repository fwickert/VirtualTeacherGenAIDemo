import './dashboardTab.css';
import * as React from 'react';
import { useEffect } from 'react';
import { makeStyles, Tab, TabList } from '@fluentui/react-components';
import type { TabValue, SelectTabData, SelectTabEvent, } from "@fluentui/react-components";
import MarkdownRenderer from '../Utilities/markdownRenderer';
import { DialogPrompt } from '../Utilities/DialogPrompt';
import { ButtonGenAI } from './buttonGenAI';
import { useDashboardContextState } from '../sharedContext/dashboardContextState';
import type { DashboardState, DashboardItem } from '../sharedContext/dashboardContextState';
import { v4 as uuidv4 } from 'uuid';
import { Skeleton3Rows } from '../Utilities/skeleton3rows';
import { Skeleton2Rows } from '../Utilities/skeleton2rows';




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
    }, [props.chatId]);

    const [selectedValue, setSelectedValue] = React.useState<TabValue>("Summary");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    const updateDashboardItem = (updatedItem: DashboardItem) => {
        setDashboardState(prevState => ({
            ...prevState,
            items: prevState.items.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            )
        }));
    };

    const Summary = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Summary" className="tabpanel">
            <ButtonGenAI item={dashboardState.items.find(q => q.infoType == "Summary")!} updateDashboardItem={updateDashboardItem} />
            <DialogPrompt title="Summary prompt" prompt="Summarize" />
            <section className="frame">
                {
                    dashboardState.items.find(q => q.infoType == "Summary")?.content === "" ?
                        <Skeleton2Rows /> :
                        <span id="summary"> {dashboardState.items.find(q => q.infoType == "Summary")?.content!}</span>
                }
            </section>
            <ButtonGenAI item={dashboardState.items.find(q => q.infoType == "Products")!} updateDashboardItem={updateDashboardItem} />
            <DialogPrompt title="Products prompt" prompt="Products" />
            <section className="frame">
                {
                    dashboardState.items.find(q => q.infoType == "Products")?.content === "" ?
                        <Skeleton2Rows /> :
                        <span id="products"> <MarkdownRenderer markdown={dashboardState.items.find(q => q.infoType == "Products")?.content!} /></span>
                }
            </section>
            <ButtonGenAI item={dashboardState.items.find(q => q.infoType == "Keywords")!} updateDashboardItem={updateDashboardItem} />
            <DialogPrompt title="Keywords prompt" prompt="Keywords" />
            <section className="frame">
                {
                    dashboardState.items.find(q => q.infoType == "Keywords")?.content === "" ?
                        <Skeleton2Rows /> :
                        <span id="keywords"> <MarkdownRenderer markdown={dashboardState.items.find(q => q.infoType == "Keywords")?.content!} /></span>
                }

            </section>
        </div>
    ));

    const Advice = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Advice" className="tabpanel">
            <ButtonGenAI item={dashboardState.items.find(q => q.infoType == "Advice")!} updateDashboardItem={updateDashboardItem} />
            <DialogPrompt title="Advice prompt" prompt="Advice" />
            <section className="frame">
                {
                    dashboardState.items.find(q => q.infoType == "Advice")?.content === "" ?
                        <Skeleton2Rows /> :
                        <span id="advice"> <MarkdownRenderer markdown={dashboardState.items.find(q => q.infoType == "Advice")?.content!} /></span>
                }
            </section>
        </div>
    ));

    const Example = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Example" className="tabpanel">
            <ButtonGenAI item={dashboardState.items.find(q => q.infoType == "Example")!} updateDashboardItem={updateDashboardItem} />
            <DialogPrompt title="Example prompt" prompt="Example" />
            <section className="frame">
                {
                    dashboardState.items.find(q => q.infoType == "Example")?.content === "" ?
                        <Skeleton2Rows /> :
                        <span id="example"> <MarkdownRenderer markdown={dashboardState.items.find(q => q.infoType == "Example")?.content!} /></span>
                }
            </section>
        </div>
    ));

    const Evaluation = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Evaluation" className="tabpanel">
            <ButtonGenAI item={dashboardState.items.find(q => q.infoType == "Evaluation")!} updateDashboardItem={updateDashboardItem} />
            <DialogPrompt title="Evaluation prompt" prompt="Evaluation" />
            <section className="frame">
                {
                    dashboardState.items.find(q => q.infoType == "Evaluation")?.content === "" ?
                        <Skeleton2Rows /> :
                        <span id="evaluation"> <MarkdownRenderer markdown={dashboardState.items.find(q => q.infoType == "Evaluation")?.content!} /></span>
                }
            </section>
        </div>
    ));



    return (
        <div>
            <TabList className="tab" selectedValue={selectedValue} onTabSelect={onTabSelect}>
                <Tab value="Summary">Summary</Tab>
                <Tab value="Advice">Advice</Tab>
                <Tab value="Example">Example</Tab>
                <Tab value="Evaluation">Evaluation</Tab>
            </TabList>
            {dashboardState.conversation === "" ?
                <Skeleton3Rows />
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