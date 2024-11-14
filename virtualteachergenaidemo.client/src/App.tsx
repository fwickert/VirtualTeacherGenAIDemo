
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/home';
import LastTraining from './views/trainingList/lastTraining';
import Dashboard from './views/dashboard/dashboard';
import Coach from './views/coach/coach';
import Agent from './views/agent/agent';
import Scenario from './views/scenario/scenario';
import Training from './views/training/training';
import Session from './views/session/session';

function App(props: any) {

    return (
      
        <Router>
            
            <Routes>
                <Route path="/" element={<Home title={props.title } />} />
                <Route path="/training" element={<Training />} />
                <Route path="/session" element={<Session />} />
                <Route path="/lastTraining" element={<LastTraining />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/coach" element={<Coach />} />
                <Route path="/agent" element={<Agent />} />
                <Route path="/scenarios" element={<Scenario title="Scenarios List" isForSimulation={false} />} />
            </Routes>
        </Router>

       
    );


}

export default App;