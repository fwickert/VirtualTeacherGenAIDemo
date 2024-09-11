import './dashboardTab.css';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Spinner } from '@fluentui/react-components';
import { makeStyles, Tab, TabList } from '@fluentui/react-components';
import type { TabValue, SelectTabData, SelectTabEvent, } from "@fluentui/react-components";
import { Button } from '@fluentui/react-components';
import MarkdownRenderer from './markdownRenderer';
import { DialogPrompt } from './DialogPrompt';



interface IDashboard {
    id: string;
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

export const DashboardTab = (param: any) => {
    const [dashboard, setDashboard] = useState<IDashboard[]>();
    const styles = useStyles();
    

    useEffect(() => {
        getDashboard(param.chatId);
    }, []);

    const [selectedValue, setSelectedValue] =
        React.useState<TabValue>("Summary");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    const summary = dashboard?.find(q => q.infoType == "Summary")?.content;
    const products = dashboard?.find(q => q.infoType == "Products")?.content;
    const keywords = dashboard?.find(q => q.infoType == "Keywords")?.content;
    const advice = dashboard?.find(q => q.infoType == "Advice")?.content;
    const example = dashboard?.find(q => q.infoType == "Example")?.content;
    const evaluation = dashboard?.find(q => q.infoType == "Evaluation")?.content;

    const Summary = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Summary" className="tabpanel">
            <Button>Create Summary</Button>                                  
            <DialogPrompt title="Summary prompt" prompt="Summarize" />
            <section className="frame">
                {summary!}
            </section>
            <Button>List Products</Button>
            <DialogPrompt title="Products prompt" prompt="Products" />
            <section className="frame">
                <MarkdownRenderer markdown={products!} />
            </section>
            <Button>Get Keywords</Button>
            <DialogPrompt title="Keywords prompt" prompt="Keywords" />
            <section className="frame">
                <MarkdownRenderer markdown={keywords!} />
            </section>
        </div>
    ));

    const Advice = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Advice" className="tabpanel">
            <Button>Get Advice</Button>
            <DialogPrompt title="Advice prompt" prompt="Advice" />
            <section className="frame">                
                <MarkdownRenderer markdown={advice!} />
            </section>
        </div>
    ));

    const Example = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Example" className="tabpanel">
            <Button>Get Example</Button>
            <DialogPrompt title="Example prompt" prompt="Example" />
            <section className="frame">
                <MarkdownRenderer markdown={example!} />
            </section>
        </div>
    ));

    const Evaluation = React.memo(() => (
        <div role="tabpanel" aria-labelledby="Evaluation" className="tabpanel">
            <Button>Get Evaluation</Button>
            <DialogPrompt title="Evaluation prompt" prompt="Evaluation" />
            <section className="frame">
                <MarkdownRenderer markdown={evaluation!} />
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