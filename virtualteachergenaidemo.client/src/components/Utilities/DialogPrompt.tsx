import { Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-dialog';
import { Button } from '@fluentui/react-button';
import { Prompt20Filled } from '@fluentui/react-icons';
import { useEffect, useState } from 'react';
import PromptService from '../../services/PromptService'; 

export const DialogPrompt = (props: any) => {
    const [prompt, setPrompt] = useState<string>();

    useEffect(() => {
        fetchPrompt(props.title);
    }, [props.title]);

    async function fetchPrompt(prompt: string) {
        const data = await PromptService.getPrompt(prompt);
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
