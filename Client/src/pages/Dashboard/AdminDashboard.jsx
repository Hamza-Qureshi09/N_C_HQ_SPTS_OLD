import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import style from './AdminDashboard.module.scss'
import Sidebar from '../../components/Shared/Sidebar/Sidebar'
import Navbar from '../../components/Shared/Navbar/Navbar'
import { useSelector } from 'react-redux'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import Carousel from 'react-bootstrap/Carousel';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import axios from 'axios'
import moment from 'moment'


const AdminDashboard = () => {
  const { status } = useSelector((state) => { return state.controls })
  const [data, setdata] = useState({
    Classes: "", Students: "", Events: "", Teachers: "", Exams: "", Holidays: ""
  })
  const [Allevents, setAllevents] = useState([])
  const [AllHolidays, setAllHolidays] = useState([])
  const Role = localStorage.getItem('Role')
  const navigate = useNavigate()
  const ref = useRef()
  ref.current = false
  const loadData = async () => {
    const { data } = await axios.get('/api/Get/DashboardInfo')// here fetch all data
    // console.log(data);
    setdata({ Classes: data.Classes, Students: data.Students, Events: data.Events, Teachers: data.Teachers, Exams: data.Exams, Holidays: data.Holidays })
    setAllevents(data.Event)
    setAllHolidays(data.Holiday)
  }
  useEffect(() => {
    if (ref.current === true) {
      loadData()
    }
    return () => {
      ref.current = true
    }
  }, [])
  console.log(Allevents.map((val) => { }));
  return (
    <>
      <Navbar />
      <div className={style.DashboardWrapper}>
        <Sidebar ToggleStatus={status} />
        <div className={status ? style.AdminDashboardSmall : style.AdminDashboardFull}>


          {/* creating dashbord content here */}
          <div className={style.DashboardContainer}>
            <div className={style.DashboardCardsTop}>
              <div className={style.Card}>
                <div className={style.cardTop}>
                  <h1>{data.Classes}</h1>
                  <EmojiEventsOutlinedIcon className={style.StyleDashboardIcons} />
                </div>
                <div className={style.cardMid}>
                  <h3>Classes</h3>
                  <p>These Events makes Students mind fresh,</p>
                </div>
                <div className={style.cardBottom}>
                  <button onClick={() => navigate(`/${Role}/Classes`)} >Manage Events <ArrowCircleRightIcon className={style.cardbottomBtnIcon} /></button>
                </div>
              </div>
              <div className={style.Card}>
                <div className={style.cardTop}>
                  <h1>{data.Students}</h1>
                  <DriveFileRenameOutlineOutlinedIcon className={style.StyleDashboardIcons} />
                </div>
                <div className={style.cardMid}>
                  <h3>Available Students</h3>
                  <p>These Events makes Students mind fresh,</p>
                </div>
                <div className={style.cardBottom}>
                  <button onClick={() => navigate(`/${Role}/Students`)}>Add Students <ArrowCircleRightIcon className={style.cardbottomBtnIcon} /></button>
                </div>
              </div>
              <div className={style.Card}>
                <div className={style.cardTop}>
                  <h1>{data.Teachers}</h1>
                  <DriveFileRenameOutlineOutlinedIcon className={style.StyleDashboardIcons} />
                </div>
                <div className={style.cardMid}>
                  <h3>Available Teachers</h3>
                  <p>These Events makes Students mind fresh,</p>
                </div>
                <div className={style.cardBottom}>
                  <button onClick={() => navigate(`/${Role}/Teacher`)}>Add Teachers <ArrowCircleRightIcon className={style.cardbottomBtnIcon} /></button>
                </div>
              </div>
              <div className={style.Card}>
                <div className={style.cardTop}>
                  <h1>{data.Exams}</h1>
                  <AssignmentTurnedInOutlinedIcon className={style.StyleDashboardIcons} />
                </div>
                <div className={style.cardMid}>
                  <h3>School Exams</h3>
                  <p>These Events makes Students mind fresh,</p>
                </div>
                <div className={style.cardBottom}>
                  <button onClick={() => navigate(`/${Role}/Exams`)}>Manage Exams <ArrowCircleRightIcon className={style.cardbottomBtnIcon} /></button>
                </div>
              </div>

            </div>


            {/*  */}
            <div className={style.DashboardMidPard}>
              <div className={style.TodaysEvents}>
                <h1>Recent Events {' >>'} </h1>

                {Allevents.length === 0 ? "No Event Announce Yet!" :
                  <Carousel>
                    {Allevents.map((val, index) => {
                      return <Carousel.Item interval={1000} className={style.slide} key={index}>
                        <img
                          className="d-block w-100"
                          src={`/Storage/Events/${val.EventPicture}`}
                          alt="First slide"
                        />
                        <Carousel.Caption className={style.slideText} style={{ backgroundColor: "gray", borderRadius: "10px" }}>
                          <h3>{val.Title}</h3>
                          <p>{val.Description}</p>
                        </Carousel.Caption>
                      </Carousel.Item>
                    })}
                  </Carousel>
                }


              </div>
              <div className={style.UpcommingEvents}>
                <h1>Up Comming Holiday{'>>'}</h1>
                {AllHolidays.length === 0 ? "No Holiday Announce Yet!" :
                  <div className={style.HolidaysContainer}>
                    {AllHolidays.map((val, index) => {
                      return <div className={style.HolidaySide}>
                     <div className={style.title}>
                     <h3>{val.Title} </h3> <span><AddTaskOutlinedIcon className={style.Upcommingholiday} /></span>
                     </div>
                        <p><b>Holiday Date:</b> <span>{moment(new Date(val.StartDate)).format("YYYY-MM-DD")}</span></p>
                      </div>
                    })}
                  </div>
                }

              </div>
            </div>
          </div>


        </div>
      </div>
    </>
  )
}

export default AdminDashboard 