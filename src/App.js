import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './firebaseConfig'
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/RegisterForm';
import Dialogs from './components/Dialogs';
import Users from './components/Users'
import { ToastContainer } from 'react-toastify';



function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={
         
            <Home />
         
        }/>
        <Route path='/login' element={<Login/>} />
        <Route path='/Register' element={<Register/>} />
        <Route path='/users' element={<Users/>} />
      </Routes>
      <ToastContainer/>
        <Dialogs/>
    </AuthProvider>
  );
}

export default App;
