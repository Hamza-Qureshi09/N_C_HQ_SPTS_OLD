import React, { useState } from 'react'
import style from './Sidebar.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { sideBarToggleFunc } from '../../../store/controls/control'
import { NavLink } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import TouchAppIcon from '@mui/icons-material/TouchApp';
// import UpcomingIcon from '@mui/icons-material/Upcoming';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';

const Sidebar = ({ ToggleStatus }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => { return state.controls })
  const [SidebarItemList, setSidebarItemList] = useState(false)
  const Role = localStorage.getItem("Role");


  const ToggleSidebarFunc = (e) => {
    dispatch(sideBarToggleFunc({ newStatus: !status }))
  }

  // const setNewRoute = (Route) => {
  //   localStorage.setItem("ActiveClass", Route)
  // }
  // const ActiveClass = localStorage.getItem("ActiveClass")

  const ToggleSidebarListItems = () => {
    setSidebarItemList(!SidebarItemList)
  }
  return (
    <div className={ToggleStatus ? style.Sidebar : style.SidebarHide}>
      {(window.innerWidth <= 900 && ToggleStatus === false) ?
        <div className={style.SidebarNavbar}>
          <div className={style.logo}>
            <img src="/images/mongodb.png" alt="profile" />
            <h3>
              SPRS
            </h3>
          </div>
          <div className={style.CloseBtn}>
            <CloseIcon className={style.close} onClick={ToggleSidebarFunc} />
          </div>
        </div>
        :
        ""}

      {/* creating sidebar lists */}
      <div className={style.items}>
        <div className={style.itemContainer}>
          <div className={style.sidebarItem}>
            <b>Dashboard</b>
            <div className={style.list} >
              <NavLink to={Role==="Admin"?"/Admin/Dashboard":Role==="Teacher"?"/Teacher/Dashboard":Role==="Parent"?"/Parent/Dashboard":""} >
                <DashboardOutlinedIcon className={style.iconDesign} />
                <span>Dashboard</span>
              </NavLink>           </div> 
            <div className={style.list} style={Role==="Admin"?{display:"flex"}:{display:"none"}}>
              <NavLink to={Role==="Admin"?"/Admin/Events":""} >
                <EmojiEventsOutlinedIcon className={style.iconDesign} />
                <span>Events</span>
              </NavLink>           </div>
            <div className={style.list} style={Role==="Parent"?{display:"none"}:{display:"flex"}}>
              <NavLink to={Role==="Admin"?"/Admin/StudentA":Role==="Teacher"?"/Teacher/StudentA":""} >
                <CalendarMonthIcon className={style.iconDesign} />
                <span>Student Attendance</span>
              </NavLink>           </div>
            <div className={style.list}>
              <NavLink to={Role==="Admin"?"/Admin/Appointments":Role==="Teacher"?"/Teacher/Appointments":Role==="Parent"?"/Parent/Appointments":""}>
                <TouchAppIcon className={style.iconDesign} />
                <span>Appointments</span>
              </NavLink>           </div>
          </div>


          <div className={style.sidebarItem} style={Role==="Parent"?{display:"none"}:{display:"block"}}>
            <b>Management</b>
            <div className={style.listtwo} onClick={ToggleSidebarListItems}>
              <div className={style.showmore}>
                <CalendarMonthIcon className={style.iconDesign} />
                <span>Manage Work</span>
              </div>
              {SidebarItemList ? <ArrowDropDownOutlinedIcon /> : <ArrowDropUpOutlinedIcon />}

            </div>
            <div className={SidebarItemList ? style.dropDownListsShow : style.dropDownListsHide}  >
              <div className={style.list} style={Role==="Admin"?{display:"flex"}:{display:"none"}}>
                <NavLink to={Role==="Admin"?"/Admin/Classes":""} >
                  <AutoStoriesOutlinedIcon className={style.iconDesign} />
                  <span>class management </span>
                </NavLink>             </div>
              <div className={style.list} style={Role==="Admin"?{display:"flex"}:{display:"none"}}>
                <NavLink  to={Role==="Admin"?"/Admin/Subjects":""}>
                  <AppRegistrationOutlinedIcon className={style.iconDesign} />
                  <span>subject management</span>
                </NavLink>             </div>
              <div className={style.list} style={Role==="Admin"?{display:"flex"}:{display:"none"}}>
                <NavLink to={Role==="Admin"?"/Admin/Students":""}>
                  <DriveFileRenameOutlineOutlinedIcon className={style.iconDesign} />
                  <span>student management</span>
                </NavLink>             </div>
              <div className={style.list} style={Role==="Parent"?{display:"none"}:{display:"flex"}}>
                <NavLink to={Role==="Admin"?"/Admin/Exams":Role==="Teacher"?"/Teacher/Exams":""} >
                  <AssignmentTurnedInOutlinedIcon className={style.iconDesign} />
                  <span>exam management</span>
                </NavLink>             </div>
              <div className={style.list} style={Role==="Admin"?{display:"flex"}:{display:"none"}}>
                <NavLink to={Role==="Admin"?"/Admin/Teacher":""} >
                  <DriveFileRenameOutlineOutlinedIcon className={style.iconDesign} />
                  <span>teacher management</span>
                </NavLink>             </div>
              <div className={style.list}  style={Role==="Admin"?{display:"flex"}:{display:"none"}}>
                <NavLink to={Role==="Admin"?"/Admin/Holidays":""} >
                  <AddTaskOutlinedIcon className={style.iconDesign} />
                  <span>holiday mangement</span>
                </NavLink>             </div>
            </div>
          </div>


          <div className={style.sidebarItem} style={Role==="Teacher"?{display:"none"}:{display:"block"}}>
            <b>Fee Manage</b>
            <div className={style.list} style={Role==="Admin"?{display:"flex"}:{display:"none"}}>
              <NavLink  to={Role==="Admin"?"/Admin/FeeManage":""}>
                <MonetizationOnOutlinedIcon className={style.iconDesign} />
                <span>Fee Management</span>
              </NavLink>           </div>
            <div className={style.list} style={Role==="Parent"?{display:"flex"}:{display:"none"}}>
              <NavLink to={Role==="Parent"?"/Parent/viewFeeChallan":""} >
                <MonetizationOnOutlinedIcon className={style.iconDesign} />
                <span>Fee Challan</span>
              </NavLink>           </div>
          </div>


          <div className={style.sidebarItem}>
            <b>Others</b>
            <div className={style.list} style={Role==="Parent"?{display:"flex"}:{display:"none"}}>
              <NavLink to={Role==="Parent"?"/Parent/StudentReport":""} >
                <LocalActivityIcon className={style.iconDesign} />
                <span>Student Report</span>
              </NavLink>           </div>
            <div className={style.list} style={Role==="Parent"?{display:"none"}:{display:"flex"}}>
              <NavLink to={Role==="Admin"?"/Admin/Activity":Role==="Teacher"?"/Teacher/Activity":""} >
                <LocalActivityIcon className={style.iconDesign} />
                <span>Daily Activity</span>
              </NavLink>           </div>
            {/* <div className={style.list} style={Role==="Parent"?{display:"none"}:{display:"flex"}}>
              <NavLink to={Role==="Admin"?"/Admin/TimeTable":Role==="Teacher"?"/Teacher/TimeTable":""} >
                <CalendarMonthIcon className={style.iconDesign} />
                <span>time table</span>
              </NavLink>           </div> */}
            {/* <div className={style.list}  style={Role==="Teacher"?{display:"flex"}:{display:"none"}}>
              <NavLink to={Role==="Teacher"?"/Teacher/DailyDiary":""} >
                <AddTaskOutlinedIcon className={style.iconDesign} />
                <span>daily diary</span>
              </NavLink>           </div> */}
            <div className={style.list}>
              <NavLink  to={Role==="Admin"?"/Admin/LeaveApplication":Role==="Teacher"?"/Teacher/LeaveApplication":Role==="Parent"?"/Parent/LeaveApplication":""}>
                <AppRegistrationOutlinedIcon className={style.iconDesign} />
                <span>leave application</span>
              </NavLink>           </div>
            {/* <div className={style.list}  style={Role==="Parent"?{display:"none"}:{display:"flex"}}>
              <NavLink to={Role==="Admin"?"/Admin/YearPlanner":Role==="Teacher"?"/Teacher/YearPlanner":""} >
                <CalendarMonthIcon className={style.iconDesign} />
                <span>year planner</span>
              </NavLink>           </div> */}
            <div className={style.list}  style={{display:"flex"}}>
              <NavLink   to={Role==="Admin"?"/Admin/Feadback":Role==="Parent"?"/Parent/Feadback":"/Teacher/Feadback"} >
                <DriveFileRenameOutlineOutlinedIcon className={style.iconDesign} />
                <span>feedback</span>
              </NavLink>           </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Sidebar