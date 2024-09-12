import "./dashboard.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardTab } from '../../components/dashboard/dashboardTab';
import ChatHistory from '../../components/dashboard/chatHistory';
import { DashboardContextStateProvider } from '../../components/sharedContext/dashboardContextState';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-components';

function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { chatId } = location.state;

    const handleBackClick = () => {
        navigate('/lastTraining');
    };

    

    return (
        <div className="grid-container">
            
            <div className="header">                              
                <section className="intro">
                    <div className="back">
                        <Button size="large" appearance="transparent" onClick={handleBackClick} icon={<ArrowCircleLeft48Filled /> } />
                    </div>
                    <h1 className="title">Your Dashboard</h1>
                    <p className="intro">
                        Your personal dashboard will display all information about a simulation. You can review the discussion, the summary, advice and the feedback.
                    </p>
                </section>
            </div>
            <DashboardContextStateProvider>
                <div className="chat">
                    <div className="chatHistoryTitle">Conversation</div>
                    <ChatHistory chatId={chatId} />
                </div>
                <div className="dashboard">
                    <DashboardTab chatId={chatId} />
                </div>
            </DashboardContextStateProvider>
        </div>
    );
}

export default Dashboard;