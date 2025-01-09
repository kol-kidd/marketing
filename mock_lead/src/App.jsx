import { useState,  useEffect } from 'react'
import axios from 'axios';
import './App.css'
import { Link, Routes, Route, useLocation } from 'react-router-dom'
import Form from './form';
import Login from './Login'
import Register from './Register';
import Campaign from './campaign';
import { jwtDecode } from 'jwt-decode'
import Header from './Header';

function App() {
  const [campID, setCampID] = useState('');
  const path = useLocation();

  const handleLink = (id) => {
    setCampID(id);
  }

  const isPathLogin = location.pathname === '/'

  return (
    <>
    <div className="grid grid-cols-12 w-dvw gap-32">
      <div className="col-span-12">
        <Header/>
      </div>
      <div className="col-span-12 p-5">
       <Routes>
        <Route path="/" element={<Campaign handleLink={handleLink}/>}/>
        <Route path="/form/:id" element={<Form/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
       </Routes>
      </div>
    </div>  
    </>
    
  )
}

export default App
