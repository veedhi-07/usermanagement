import './App.css'
import {Routes, Route} from "react-router-dom";


import Login from './pages/public/Login';
import Signup from './pages/public/signup';
import Home from './pages/private/Home';

function App() {
    return (
        <Routes>
            <Route path = "/" element = {<Login/>} />
            <Route path = "/login" element = {<Login/>} />
            <Route path = "/signup" element = {<Signup/>} />
            <Route path = "/home" element = {<Home/>} />
        </Routes>
      
        );
    }

export default App
