import './chatWindow.css';
import { Input, makeStyles, shorthands } from '@fluentui/react-components';
import { SendRegular, MicRegular } from "@fluentui/react-icons";


const useClasses = makeStyles({
    container: {
        display: "flex",
        ...shorthands.gap("5px"),
    },

    icon24: { fontSize: "24px" },
    icon32: { fontSize: "32px" },
    icon48: { fontSize: "48px" },

});



function ChatWindow() {
    
    const classes = useClasses();
    return (
        <div className='container'>
            <div className="chat-window">
                <div className="chat-header">Chat</div>
                <div className="chat-messages">
                </div>
                <div className="chat-input">

                    <Input placeholder="Type a message" className='fullwidth' />

                    <MicRegular className={classes.icon24} />
                    <SendRegular className={classes.icon24} />

                </div>
            </div>
        </div>
    )

  

};

export default ChatWindow;