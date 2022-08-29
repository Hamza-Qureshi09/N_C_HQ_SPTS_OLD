import React from 'react'
import { useLocation, Outlet, Navigate } from 'react-router-dom'

const ProtectedRoutesForTeacher = ({ allowedRole, status }) => {
    const location = useLocation()
    return (
        status === "true" && allowedRole === "Teacher" ?
            <Outlet />
            : status === "false" || status === "true" ?
                <Navigate to="/Auth/Login" state={{ from: location }} replace />
                // if status not equal to admin then navigate to these route
                : allowedRole === "Admin" && status === "true" ?
                    <Navigate to="/Admin/Dashboard" state={{ from: location }} replace />
                    : allowedRole === "Parent" && status === "true" ?
                        <Navigate to="/Parent/Dashboard" state={{ from: location }} replace />
                        : <Navigate to="/falseRequests" state={{ from: location }} replace />
    )
}

export default ProtectedRoutesForTeacher