
import Login from "./components/login/login";
import Register from "./components/register/register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import SetReminder from './components/SetReminder'
import Header from './components/header/Header'

function App() {
  const [user, setLoginUser] = useState({});

  return (
    <>
    <Header/>
    <div className="App">
      
      <Router>
        
        
        <Routes>
          <Route path="/" element={user && user._id ? <SetReminder setLoginUser={setLoginUser} /> : <Login setLoginUser={setLoginUser} />} />
          <Route path="/login" element={<Login setLoginUser={setLoginUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
    </>
  );
  
}

export default App;
