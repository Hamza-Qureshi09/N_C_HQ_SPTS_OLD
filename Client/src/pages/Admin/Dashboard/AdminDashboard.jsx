import React from 'react'
import style from './AdminDashboard.module.scss'
import Sidebar from '../../../components/Shared/Sidebar/Sidebar'
import { useSelector } from 'react-redux'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import Carousel from 'react-bootstrap/Carousel';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';


const AdminDashboard = () => {
  const { status } = useSelector((state) => { return state.controls })
  return (
    <div className={style.DashboardWrapper}>
      <Sidebar ToggleStatus={status} />
      <div className={status ? style.AdminDashboardSmall : style.AdminDashboardFull}>


        {/* creating dashbord content here */}
        <div className={style.DashboardContainer}>
          <div className={style.DashboardCardsTop}>
            <div className={style.Card}>
              <div className={style.cardTop}>
                <h1>07</h1>
                <EmojiEventsOutlinedIcon className={style.StyleDashboardIcons} />
              </div>
              <div className={style.cardMid}>
                <h3>School Events</h3>
                <p>These Events makes Students mind fresh,</p>
              </div>
              <div className={style.cardBottom}>
                <button>Manage Events <ArrowCircleRightIcon className={style.cardbottomBtnIcon} /></button>
              </div>
            </div>
            <div className={style.Card}>
              <div className={style.cardTop}>
                <h1>05</h1>
                <DriveFileRenameOutlineOutlinedIcon className={style.StyleDashboardIcons} />
              </div>
              <div className={style.cardMid}>
                <h3>Available Students</h3>
                <p>These Events makes Students mind fresh,</p>
              </div>
              <div className={style.cardBottom}>
                <button>Add Students <ArrowCircleRightIcon className={style.cardbottomBtnIcon} /></button>
              </div>
            </div>
            <div className={style.Card}>
              <div className={style.cardTop}>
                <h1>07</h1>
                <DriveFileRenameOutlineOutlinedIcon className={style.StyleDashboardIcons} />
              </div>
              <div className={style.cardMid}>
                <h3>Available Teachers</h3>
                <p>These Events makes Students mind fresh,</p>
              </div>
              <div className={style.cardBottom}>
                <button>Add Teachers <ArrowCircleRightIcon className={style.cardbottomBtnIcon} /></button>
              </div>
            </div>
            <div className={style.Card}>
              <div className={style.cardTop}>
                <h1>07</h1>
                <AssignmentTurnedInOutlinedIcon className={style.StyleDashboardIcons} />
              </div>
              <div className={style.cardMid}>
                <h3>School Events</h3>
                <p>These Events makes Students mind fresh,</p>
              </div>
              <div className={style.cardBottom}>
                <button>Manage Exams <ArrowCircleRightIcon className={style.cardbottomBtnIcon} /></button>
              </div>
            </div>

          </div>


          {/*  */}
          <div className={style.DashboardMidPard}>
            <div className={style.TodaysEvents}>
              <h1>Recent Events {' >>'} </h1>

              <Carousel>
                <Carousel.Item interval={1000} className={style.slide}>
                  <img
                    className="d-block w-100"
                    src="/images/courseone.jpg"
                    alt="First slide"
                  />
                  <Carousel.Caption className={style.slideText}>
                    <h3>14 August Holiday</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={500}  className={style.slide}>
                  <img
                    className="d-block w-100"
                    src="/images/coursetwo.jpg"
                    alt="Second slide"
                  />
                  <Carousel.Caption  className={style.slideText}>
                    <h3>Metting</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
         
            </div>
            <div className={style.UpcommingEvents}>
              <h1>Up Comming Holiday{'>>'}</h1>

              <div className={style.HolidaysContainer}>
                <div className={style.HolidaySide}>
                  <h3>Title <span><AddTaskOutlinedIcon className={style.Upcommingholiday}/></span></h3>
                  <p><b>Holiday Date:</b> <span>12-Aug-2022</span></p>
                  
                </div>
                <div className={style.HolidaySide}>
                  <h3>Title <span><AddTaskOutlinedIcon className={style.Upcommingholiday}/></span></h3>
                  <p><b>Holiday Date:</b> <span>12-Aug-2022</span></p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default AdminDashboard 