import React, { useState } from 'react'
// import { Link } from 'react-router-dom';
import style from './RegisterLogin.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { validateAndCheckUser } from '../../store/auth/user';


const RegisterLogin = ({ role, link, btn, linkBtn }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [inputs, setinputs] = useState({
        username: "",
        email: "",
        password: ""
    });




    // login of user
    const signinUser = async () => {
        const { username, email, password } = inputs;
        if (!username || !email || !password) {
            return window.alert("please fill all the fields first!")
        }
        try {
            const response = await axios.post("/api/auth/Login", {
                username, email, password
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                withCredentials: true
            })
            const data = await response.data;
            if (response.status === 200) { 
                dispatch(validateAndCheckUser(data))
                localStorage.setItem("Status", "true")
                localStorage.setItem("Role", data.Role)
                // localStorage.setItem("ActiveClass","Dashboard")
                if (data.Role === "Admin") {
                    return navigate('/Admin/Dashboard'
                    // , { state: {
                    //     status:"true",
                    //     Role:"Admin"
                    // }}
                    )
                }else if(data.Role==="Teacher"){
                    return navigate('/Teacher/Dashboard')
                }else if(data.Role==="Parent"){
                    return navigate('/Parent/Dashboard')
                }
            }
        } catch (error) {
            console.log(error.status);
            return window.alert("Login faild!")
        }
    }




    // handle inputs changes
    const handleInput = (event) => {
        const { name, value } = event.target;
        setinputs((preval) => {
            return {
                ...preval,
                [name]: value.toLowerCase() 
            }
        })
    }
    return (
        <div className={style.RegisterLogin}>
            <div className={style.RegisterLoginCard}>
                <div className={style.Card}>
                    <div className={style.inputField}>
                        <label htmlFor='username'>Username</label>
                        <input type="text" name="username" value={inputs.username} placeholder="Enter Username.." id='username' onChange={handleInput} />
                    </div>
                    <div className={style.inputField}>
                        <label htmlFor='email'>Email</label>
                        <input type="email" name="email" required value={inputs.email} placeholder="Enter Email.." id='email' onChange={handleInput} />
                    </div>
                    <div className={style.inputField}>
                        <label htmlFor='password'>Password</label>
                        <input type="password" name="password" value={inputs.password} placeholder="Enter Password.." id='password' onChange={handleInput} />
                    </div>
                    <div className={style.buttonField}>
                        <button onClick={role === "loginPage" && signinUser}>{btn}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterLogin