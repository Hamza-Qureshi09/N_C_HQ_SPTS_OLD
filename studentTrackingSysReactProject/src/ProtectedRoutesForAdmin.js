import React from 'react'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
// import { useSelector } from 'react-redux';

const ProtectedRoutesForAdmin = ({allowedRole, status }) => { 
    // const { role } = useSelector((state) => { return state.userAuth });
    const location = useLocation();
    // const UserRole = location.state.Role


    return (
        status === "true" && allowedRole === "Admin"  ?
            <Outlet /> //it means childern all routes 
            // if status false it means not login & if he shut down window and come back then he was true so,
            : status === "false" || status === "true" ?
                <Navigate to="/Auth/Login" state={{ from: location }} replace />
                // if status not equal to admin then navigate to these route
                : allowedRole === "Teacher" && status === "true" ?
                    <Navigate to="/Teacher/Dashboard" state={{ from: location }} replace />
                    : allowedRole === "Parent" && status === "true" ?
                        <Navigate to="/Parent/Dashboard" state={{ from: location }} replace />
                        : <Navigate to="/falseRequests" state={{ from: location }} replace />
    )
}

export default ProtectedRoutesForAdmin