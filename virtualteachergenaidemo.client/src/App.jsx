
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/home';
import Training from './views/training';



function App(props) {



    return (
      
        <Router>
            
            <Routes>
                <Route path="/" element={<Home title={props.title } />} />
                <Route path="/training" element={<Training />} />
            </Routes>
        </Router>

       
    );


}

export default App;