import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Hello from './login/Hello';
import Dashboard from './dashboard/Dashboard';
import Addtask from './dashboard/Addtask';
import Viewtask from './dashboard/Viewtask';
import Edit from './dashboard/Edit';
import Dailytask from './dashboard/Dailytask';
import Getuserbyclient from './dashboard/User';
import User from './dashboard/User';
import Profile from './dashboard/Profile';
import Leave from './dashboard/Leave';
import Client from './dashboard/Client';
import Userview from './dashboard/Userview';
import Search from './dashboard/Serch';
// import Kp from './dashboard/Kp';
// import Img from './img/Img';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<Img/>}/> */}
        <Route path='/' element={<Hello />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/addtask' element={<Addtask />} />
        <Route path='/viewtask' element={<Viewtask />} />
        <Route path='/edit' element={<Edit />} />
        <Route path='/dailytask' element={<Dailytask/>} />
        <Route path='/user' element={<User/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/leave' element={<Leave/>} />
        <Route path='/userview' element={<Userview/>} />
        <Route path='/client' element={<Client/>} /> 
        <Route path='/search' element={<Search/>} />  
        {/* <Route path='/kp' element={<Kp/>} /> */}




      </Routes>
    </BrowserRouter>
  </>
);