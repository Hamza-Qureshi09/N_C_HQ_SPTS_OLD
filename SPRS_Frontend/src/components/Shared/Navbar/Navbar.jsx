import React, { useState } from 'react';
import style from './Navbar.module.scss'
import { Navigate, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { sideBarToggleFunc } from '../../../store/controls/control';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import { validateAndCheckUser } from '../../../store/auth/user';
import { StudentRecordInfo } from '../../../store/StudentReport/StudentReport';
import { StudentsAttendence } from '../../../store/attendenceRecord/attendenceRecord';
import axios from 'axios';

const Navbar = () => {
  const dispatch = useDispatch();
  const { username,userImage } = useSelector((state) => { return state.userAuth })
  const Role=localStorage.getItem("Role")
  const { status } = useSelector((state) => { return state.controls })
  const navigate=useNavigate()
  const [ToggleProfileWindow, setToggleProfileWindow] = useState(false)
  const ToggleProfile = () => {
    setToggleProfileWindow(!ToggleProfileWindow)
  }
  const toggleFunc = () => {
    dispatch(sideBarToggleFunc({ newStatus: !status }))
  }
  const LogoutFunc=async()=>{
    const responce=await axios.get("/api/auth/LogoutUser",{withCredentials:true})
    if (responce.status === 200) {
      dispatch(validateAndCheckUser(""))
      dispatch(StudentRecordInfo(""))
      dispatch(StudentsAttendence(""))
      localStorage.clear()
      navigate("/Logout", { replace: true })
      // window.alert("user logout")
    }
  }
  return (
    <div className={style.Navbar}>
      <div className={style.leftSide}>
        <div className={style.logo}>
          <img src='/images/mongodb.png' alt="" />
          <h3>
            SPRS 
          </h3>
        </div>
        <div className={style.Hamburger}>
          <MenuIcon className={style.menu} onClick={toggleFunc} />
        </div>
      </div>
      <div className={style.rightSide}>
        <div className={style.navbarName}>
          <h1>Rahama School</h1>
        </div>
        <ul className={style.links}>
          <NotificationsNoneIcon className={style.notification} />
          {/* <MessageIcon className={style.message}/> */}
          <div className={style.ProfileAndSetting}>
            <div className={style.profile}>
              {userImage?<img src={`/Storage/Users/${userImage}`} alt="" />:""}

            </div>
            <SettingsSuggestOutlinedIcon className={style.profileSetting}
              style={{ cursor: "pointer" }}
              onClick={ToggleProfile} />
          </div>
        </ul>
        {ToggleProfileWindow ?
          <div className={style.ProfileDropDownMenu}>
            <div className={style.topPart}>
              <div className={style.ProfileCircle}>
                <img src={`/Storage/Users/${userImage}`} alt="" />
              </div>
              <b>{username}</b>
              <p>{Role}</p>
            </div>
            <div className={style.bottomPart}>
              <div className={style.items}>
                <div className={style.itemIcon}>
                  <AccountCircleOutlinedIcon className={style.icon} />
                </div>
                <b onClick={()=>navigate(`/${Role}/Profile`,{replace:true})}>Profile</b>
              </div>
              <div className={style.items}>
                <div className={style.itemIcon}>
                  <LogoutOutlinedIcon className={style.icon} />
                </div>
                <span onClick={LogoutFunc}>Logout</span>
                {/* <a href="/Logout" onClick={LogoutFunc}>Logout</a> */}
              </div>
            </div>
          </div>
          :
          ""}

      </div>
    </div>
  )
}

export default Navbar