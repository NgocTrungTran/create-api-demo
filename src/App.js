import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import UserList from './components/UserList/UserList';
import AddUser from './components/AddUser/AddUser';
import InfoUser from './components/InfoUser/InfoUser';
import EditUser from './components/EditUser/EditUser';
import UserService from './service/userService';
import { Component } from 'react';

function App(){

  return (
    <>
      <ToastContainer autoClose={2000} />
      <Navbar />
      <Routes>
        <Route path='/' element={<UserList />} />
        <Route path='/user-address' element={<UserList />} />
        <Route path='/user-address/add' element={<AddUser />} />
        <Route path='/user-address/info/:userId' element={<InfoUser />} />
        <Route path='/user-address/edit/:userId' element={<EditUser/>}/>
      </Routes>
    </>
  );
}

export default App;
