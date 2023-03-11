import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { validateAndCheckUser } from './store/auth/user';
import axios from 'axios';
import LoginRouteProtection from './LoginRouteProtection';
import ProtectedRoutesForAdmin from './ProtectedRoutesForAdmin';
import ProtectedRoutesForTeacher from './ProtectedRoutesForTeacher';
import ProtectedRoutesForParent from './ProtectRouteForParent';
import AdminDashboard from './pages/Dashboard/AdminDashboard'
import Class from './pages/Admin/Class/Class'
import Subject from './pages/Admin/Subject/Subject'
import Student from './pages/Admin/Student/Student'
import Teacher from './pages/Admin/Teacher/Teacher'
import Activity from './pages/Activity/Activity'
import Events from './pages/Admin/Events/Events'
import Exams from './pages/Exams/Exams'
import Fee from './pages/Fee/Fee'
import Holiday from './pages/Admin/Holiday/Holiday'
import Attendence from './pages/Attendence/Attendence'
import Appointments from './pages/Appointments/Appointments';
import LeavePage from './pages/Leave/Leave';
import StudentReport from './pages/StudentReport/StudentReport';
import Profile from './pages/Profile/Profile';
import Feedback from './pages/Feedback/Feedback'
import Login from './pages/Login/Login'

const Navigation = () => {
  const { role } = useSelector((state) => { return state.userAuth });
  const Status = localStorage.getItem("Status");
  const Role = localStorage.getItem("Role");

  const dispatch = useDispatch()
  const AutoLogin = async () => {
    const url = `/api/auth/Login/autoRefreshTokenRqst`;
    const responce = await axios.get(url, { withCredentials: true })
    const data = responce.data
    dispatch(validateAndCheckUser(data))
  }
  AutoLogin()
  useEffect(() => {
    if (role) {
      AutoLogin()
      // console.log("hamza")
    }
  }, []);




  // 💥 need to find a way to request server after 59m when refresh token is near to expire but request only when it is 59m
  // useEffect(() => {
  //   const timer = setTimeout(async() => {  
  //     const url = `/api/auth/Login/refreshToken`;
  //     const responce = await axios.post(url, {
  //       headers:{
  //           "Content-Type":"application/json",      
  //           Accept:"application/json"   
  //       },
  //       withCredentials:true
  //   })
  //     const data = responce.data;
  //     console.log(data);
  //   }, 20000);
  //   return () => clearTimeout(timer);
  // }, []);
  // console.log(Role)
  // console.log(role)
  return (
    <div>

      <Routes>
        {/* public route for everyone */}
        <Route path="/" element={<Navigate to="/Auth/Login" replace />} />

        {/* Protected Routes for admin */}
        <Route path="/Auth" element={<LoginRouteProtection allowedRole={role ? role : Role} />}>
          <Route path="Login" element={<Login />} />
        </Route>

        {/* Logout Route */}
        <Route path='/Logout' element={
          <>
          {/* {window.location.reload()} */}
          <Login/>
          </>
        } />
        {/* Protected Routes for admin */}
        <Route path="/Admin" element={<ProtectedRoutesForAdmin allowedRole={role ? role : Role} status={Status} />} replace={true}>
          <Route path="Dashboard" element={<AdminDashboard />} />
          <Route path="Events" element={<Events />} />
          <Route path="Classes" element={<Class />} />
          <Route path="Subjects" element={<Subject />} />
          <Route path="Teacher" element={<Teacher />} />
          <Route path="Students" element={<Student />} />
          <Route path="Holidays" element={<Holiday />} />
          <Route path="StudentA" element={<Attendence />} />
          <Route path="FeeManage" element={<Fee />} />
          <Route path="Appointments" element={<Appointments />} />
          <Route path="LeaveApplication" element={<LeavePage />} />
          <Route path="Exams" element={ <Exams/>} />
          <Route path="Activity" element={  <Activity/>} />
          <Route path="Profile" element={  <Profile/>} />
          <Route path="Feadback" element={  <Feedback/>} />
        </Route>

        {/* Protected Routes for teacher */}
        <Route path="/Teacher" element={<ProtectedRoutesForTeacher allowedRole={role ? role : Role} status={Status} />} >
          <Route path="Dashboard" element={<AdminDashboard />} />
          <Route path="StudentA" element={<Attendence />} />
          <Route path="Appointments" element={<Appointments />} />
          <Route path="LeaveApplication" element={<LeavePage />} />
          <Route path="Exams" element={ <Exams/>} />
          <Route path="Activity" element={  <Activity/>} />
          <Route path="Profile" element={  <Profile/>} />
          <Route path="Feadback" element={  <Feedback/>} />
        </Route>


        {/* Protected Routes for Parent */}
        <Route path="/Parent" element={<ProtectedRoutesForParent allowedRole={role ? role : Role} status={Status} />} >
          <Route path="Dashboard" element={<AdminDashboard />} />
          <Route path="Appointments" element={<Appointments />} />
          <Route path="LeaveApplication" element={<LeavePage />} />
          <Route path="viewFeeChallan" element={<Fee />} />
          <Route path="StudentReport" element={<StudentReport />} />
          <Route path="Profile" element={  <Profile/>} />
          <Route path="Feadback" element={  <Feedback/>} />
        </Route>


        {/* false Requests */}
        <Route path="/falseRequests" element={<h1>404 page hamza</h1>} />
        <Route path="*" element={<h1>page not existed!</h1>} />
      </Routes>

      {/* <Class/> */}
      {/* <Fee/> */}
      {/* <Subject/> */}
      {/* <Student/> */}
      {/* <Teacher/> */}
      {/* <Activity/> */}
      {/* <Events/> */}
      {/* <Exams/> */}
      {/* <Holiday/> */}
      {/* <Attendence/> */}

    </div>
  )
}

export default Navigation