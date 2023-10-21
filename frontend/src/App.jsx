import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar/NavBar'
import Footer from './global/Footer'
import { Route,Routes } from 'react-router-dom'
import JobPost from './components/jobpost/JobPost'
import JobLists from './components/joblists/JobLists'
import Login from './components/login/Login'
import Register from './components/register/Register'
import JobSeekers from './components/accounts/JobSeekers'
import Employer from './components/accounts/Employer'
import Home from './components/home/Home'
import Profile from './components/profile/Profile'



function App(props) {

  const tableData = [
    {
      id:1,
      title: 'Senior Frontend Developer ',
      jobType: 'Full-time',
      postedDate: '2023-10-01',
      applicationDeadline: '2023-10-15',
    },
    {
      id:2,
        title: 'Senior Frontend Developer',
        jobType: 'Full-time',
        postedDate: '2023-10-01',
        applicationDeadline: '2023-10-15',
      },
      {
        id:3,
        title: 'Senior Frontend Developer',
        jobType: 'Full-time',
        postedDate: '2023-10-01',
        applicationDeadline: '2023-10-15',
      },
      {
        id:4,
        title: 'Senior Frontend Developer',
        jobType: 'Full-time',
        postedDate: '2023-10-01',
        applicationDeadline: '2023-10-15',
      },
  ];
 const[showLogin,setShowLogin] = useState(false);
 const showLoginHandler=()=>{
  setShowLogin(true);
 }
 const hideLoginHandler=()=>{
  setShowLogin(false);
 }
const[showRegister,setShowRegister] = useState(false);
const showRegisterHandler=()=>{
  setShowRegister(true);
}
const hideRegisterHandler=()=>{
  setShowRegister(false);
}

{/*for Register Button */}


  return (
<div>
    <NavBar onShowLogin = {showLoginHandler} onShowRegister = {showRegisterHandler} /> 
    <Routes>
    <Route path='/' element={<Home />} />
    <Route path='seekerregister' element = {<JobSeekers />}/>
    <Route path='employer' element = {<Employer />}/>
    <Route path='profile' element = {<Profile />}/>
    </Routes>
   
    {showLogin && <Login onClose = {hideLoginHandler}/>}
   {showRegister && <Register onClose = {hideRegisterHandler} />}
  
 
 
  
    
 {/*
    <JobPost />
   <JobLists data={tableData} />
   <Employer />
    <JobSeekers />
     */}
   
    <Footer/>
   
    
    </div>
  )
}

export default App
