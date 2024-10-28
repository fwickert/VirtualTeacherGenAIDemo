import { Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-components';
import { Button } from '@fluentui/react-components';
import { Prompt20Filled } from '@fluentui/react-icons';
import { useEffect, useState } from 'react';




export const DialogPrompt = (props: any) => {
    const [prompt, setPrompt] = useState<string>();

    useEffect(() => {      
            getPrompt(props.title);
    }, []);

    async function getPrompt(prompt: string) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                functionName: prompt,
                plugin: 'DashboardPlugin'
            }),
        };

        const response = await fetch('/api/prompt', requestOptions);
        const data = await response.text();
        setPrompt(data);
    }

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <Button appearance="transparent" icon={<Prompt20Filled />}></Button>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{props.title}</DialogTitle>
                    <DialogContent className="frame" style={{ whiteSpace: 'pre-wrap', padding: '10px' }} >
                        {prompt}
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="primary">Close</Button>
                        </DialogTrigger>
                    </DialogActions>

                </DialogBody>

            </DialogSurface>
        </Dialog>
    );
};