import React from 'react'
import { useLocation, Outlet, Navigate } from 'react-router-dom'

const ProtectedRoutesForParent = ({ allowedRole, status }) => {
    const location = useLocation()
    return (
        status === "true" && allowedRole === "Parent" ?
            <Outlet />
            : status === "false" || status === "true" ?
                <Navigate to="/Auth/Login" state={{ from: location }} replace />
                // if status not equal to admin then navigate to these route
                : allowedRole === "Admin" && status === "true" ?
                    <Navigate to="/Admin/Dashboard" state={{ from: location }} replace />
                    : allowedRole === "Teacher" && status === "true" ?
                        <Navigate to="/Teacher/Dashboard" state={{ from: location }} replace />
                        : <Navigate to="/falseRequests" state={{ from: location }} replace />
    )
}

export default ProtectedRoutesForParent