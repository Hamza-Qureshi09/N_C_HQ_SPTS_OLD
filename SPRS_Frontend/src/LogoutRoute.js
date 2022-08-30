import React, { useEffect } from 'react'
import { useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { validateAndCheckUser } from './store/auth/user'


const LogoutFunc = () => {
    return (
        <>
            <h1>hamza</h1>
        </>
    )
    // const responce=await axios.get("/api/auth/LogoutUser",{withCredentials:true})
    // if (responce.status === 200) {
    //   console.log("hamza")
    //   dispatch(validateAndCheckUser(""))
    //   localStorage.clear()
    //   navigate("/Logout", { replace: true })
    //   window.alert("user logout")
    // }
    // localStorage.clear() 
    // navigate("/Logout",{replace:true})
    // window.alert("clearing")
    // localStorage.setItem("Status","false");
    // localStorage.removeItem("Role")
}
const LogoutRoute = ({ allowedRole, status }) => {
    const navigate = useNavigate()
    const dispatch=useDispatch()
    useEffect(() => {
        const logoutUser = async () => {
            const responce = await axios.get("/api/auth/LogoutUser", { withCredentials: true })
            if (responce.status === 200) {
                // window.alert("hamza")
                dispatch(validateAndCheckUser(""))
                localStorage.clear()
                navigate("/Auth/Login", { replace: true })
                // navigate("/Logout", { replace: true })
                window.alert("user logout")
            }
        }
        logoutUser()

    }, [])
    console.log(allowedRole, status)
    return (
        status === "true" && allowedRole === "Admin" ?
            <Outlet />
            : ""
        // if status false it means not login & if he shut down window and come back then he was true so,
        // : status === "false" || status === "true" ?
        //     <Navigate to="/Auth/Login" state={{ from: location }} replace />
        //     : !status && !allowedRole ?
        //         <Navigate to="/Logout" state={{ from: location }} replace />
        //         // if status not equal to admin then navigate to these route
        //         : allowedRole === "Teacher" && status === "true" ?
        //             <Navigate to="/Teacher/Dashboard" state={{ from: location }} replace />
        //             : allowedRole === "Parent" && status === "true" ?
        //                 <Navigate to="/Parent/Dashboard" state={{ from: location }} replace />
        //                 : <Navigate to="/falseRequests" state={{ from: location }} replace />
    )
}

export default LogoutRoute