
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/home';
import Training from './views/training/training';
import LastTraining from './views/trainingList/lastTraining';
import Dashboard from './views/dashboard/dashboard';
import Coach from './views/coach/coach';


function App(props: any) {

    return (
      
        <Router>
            
            <Routes>
                <Route path="/" element={<Home title={props.title } />} />
                <Route path="/training" element={<Training />} />
                <Route path="/lastTraining" element={<LastTraining />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/coach" element={<Coach />} />
            </Routes>
        </Router>

       
    );


}

export default App;