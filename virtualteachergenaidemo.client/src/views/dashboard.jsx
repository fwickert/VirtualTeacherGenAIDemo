import React, { useEffect, useState } from 'react';
import { Spinner } from "@fluentui/react-components";
import { useLocation } from 'react-router-dom';

function Dashboard() {
    const [dashboard, setDashboard] = useState();
    const location = useLocation();
    const { chatId } = location.state;


    useEffect(() => {
        getDashboard(chatId);
    }, []);


    const contents = dashboard === undefined ?
        <Spinner />
        :
        dashboard.map(item =>
            <div key={item.id}>
                <h2>{item.infoType}</h2>
                <p>{item.content}</p>
            </div>)
        


    return (
        <div>
            <h1>Dashboard : {chatId}</h1>
            {contents}
        </div>
    );

    async function getDashboard(chatid) {
        const response = await fetch('/api/dashboard?chatId=' + chatId);
        const data = await response.json();
        setDashboard(data);
    }

}

export default Dashboard;