import './chatWindow.css';

import SpeechRecognizer from '../speechRecognizer/speechRecognizer';


function ChatWindow() {


    return (
        <div className='container'>
            <div className="chat-window">
                <div className="chat-header">Chat
                    <SpeechRecognizer />
                </div>
                
                <div className="chat-messages">
                </div>
                <div className="chat-input">

                    {/*<Input placeholder="Type a message" className='fullwidth' />*/}


                    {/*<Button appearance="transparent" icon={<SendRegular className={classes.icon24} />} />*/}

                </div>
            </div>
        </div>
    )



};

export default ChatWindow;