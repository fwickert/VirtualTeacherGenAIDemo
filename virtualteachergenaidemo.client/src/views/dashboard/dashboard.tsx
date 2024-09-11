import "./dashboard.css";
import { useLocation } from 'react-router-dom';
import { DashboardTab } from '../../components/dashboard/dashboardTab';
import ChatHistory from '../../components/dashboard/chatHistory';

function Dashboard() {   
    const location = useLocation();
    const { chatId } = location.state;


    return (
        <div className="grid-container">
            <div className="header">
                <section className="intro">
                    <h1 className="title">Your Dashboard</h1>
                    <p className="intro">
                        Your personal dashboard will display all information about a simulation. You can review the discussion, the summary, advice and the feedback.
                    </p>
                </section>
            </div>
            <div className="chat">
                <div className="chatHistoryTitle">Conversation</div>
                <ChatHistory chatId={chatId} />
            </div>
            <div className="dashboard">
                <DashboardTab chatId={chatId}  />
            </div>            
        </div>
    );

   

}

export default Dashboard;