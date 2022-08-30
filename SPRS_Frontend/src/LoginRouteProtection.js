import React from 'react'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
// import { useSelector } from 'react-redux';

const LoginRouteProtection = ({ allowedRole, status }) => {
    // const { role } = useSelector((state) => { return state.userAuth });
    const location = useLocation();
    // const UserRole = location.state.Role


    return (
        allowedRole === "Admin" ?
            <Navigate to="/Admin/Dashboard" state={{ from: location }} replace />
            : allowedRole === "Teacher" ?
                <Navigate to="/Teacher/Dashboard" state={{ from: location }} replace />
                : allowedRole === "Parent" ?
                    <Navigate to="/Parent/Dashboard" state={{ from: location }} replace />
                    :  <Outlet /> //it means childern all routes 

    )
}

export default LoginRouteProtection