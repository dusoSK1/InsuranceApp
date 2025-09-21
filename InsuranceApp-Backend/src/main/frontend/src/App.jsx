import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MyNavbar from './components/MyNavbar';
import HomePage from './components/Home';
import Insurance from './components/Insurance';
import Insured from './components/Insured';
import Login from './components/Login';
import Register from './components/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';


export default function App() {
  const [policies, setPolicies] = useState([]); 

  // users will be stored in localStorage
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser")) || null
  );

  // sync users to localStorage
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // sync loggedInUser to localStorage
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem("loggedInUser");
    }
  }, [loggedInUser]);

  return (
    <Router>
      <MyNavbar 
        loggedInUser={loggedInUser} 
        setLoggedInUser={setLoggedInUser} 
        users={users} 
        setUsers={setUsers} 
      />
      <Routes>
        <Route path="/" element={<HomePage loggedInUser={loggedInUser} />} />

        <Route 
          path="/insurance" 
          element={loggedInUser ? 
            <Insurance policies={policies} setPolicies={setPolicies} /> : 
            <Navigate to="/login" replace />} 
        />
        <Route 
          path="/insured" 
          element={loggedInUser ? 
            <Insured policies={policies} /> : 
            <Navigate to="/login" replace />} 
        />
        <Route 
          path="/login" 
          element={<Login users={users} setLoggedInUser={setLoggedInUser} />} 
        />
        <Route 
          path="/register" 
          element={<Register users={users} setUsers={setUsers} />} 
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Router>
  );
}
