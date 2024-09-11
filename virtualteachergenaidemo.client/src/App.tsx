
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/home';
import Training from './views/training';
import LastTraining from './views/lastTraining';
import Dashboard from './views/dashboard';


function App(props: any) {

    return (
      
        <Router>
            
            <Routes>
                <Route path="/" element={<Home title={props.title } />} />
                <Route path="/training" element={<Training />} />
                <Route path="/lastTraining" element={<LastTraining />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>

       
    );


}

export default App;