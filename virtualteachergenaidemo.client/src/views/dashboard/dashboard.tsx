import "./dashboard.css";
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatHistory, { IChat } from '../../components/dashboard/chatHistory';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-button';
import DashboardTabs from '../../components/dashboard/dashboardTabs';
import { useUsername } from '../../auth/UserContext';
import DashboardService from '../../services/DashboardService';
import { useLocalization } from '../../contexts/LocalizationContext';

enum AuthorRoles {
    User = 0,
    Assistant = 1,
}

function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sessionId, scenarioTitle, roleAgent } = location.state;
    const [conversation, setConversation] = useState<IChat[]>([]);
    const [formattedConversation, setFormattedConversation] = useState<string>("");
    const userName = useUsername();
    const { getTranslation } = useLocalization();

    const handleBackClick = () => {
        navigate('/lastTraining');
    };

    useEffect(() => {
        getConversation(sessionId);
    }, [sessionId]);

    const getConversation = async (sessionId: string) => {
        const data = await DashboardService.getConversation(sessionId);
        const formattedConversation = data.map((message: any) => {

            const role = message.authorRole === AuthorRoles.User ? getTranslation("SellerRole") : getTranslation("ClientRole"); // Use getTranslation
            console.log(role);
            return `${role}: ${message.content}`;
        }).join("\n");
        setConversation(data);
        setFormattedConversation(formattedConversation);
    };

    return (
        <div className="grid-container">
            <div className="header">
                <section className="intro">
                    <div className="back">
                        <Button size="large" appearance="transparent" onClick={handleBackClick} icon={<ArrowCircleLeft48Filled />} />
                    </div>
                    <div className="htitle">
                        <h1>{getTranslation("DashboardTitle")}</h1>
                        <div className="additional-info">
                            <p className='intro'><strong>Scenario:</strong> {scenarioTitle} / <strong>Role:</strong> {roleAgent}</p>
                        </div>
                    </div>
                    <p className="intro">
                        {getTranslation("DashboardIntro")} {/* Use getTranslation */}
                    </p>
                </section>
            </div>
            <div className="chat">
                <div className="chatHistoryTitle">{getTranslation("ConversationTitle")}</div> {/* Use getTranslation */}
                <ChatHistory conversation={conversation} />
            </div>
            <div className="dashboard">
                <DashboardTabs sessionId={sessionId} conversation={formattedConversation} userName={userName} />
            </div>
           
        </div>
    );
}

export default Dashboard;
