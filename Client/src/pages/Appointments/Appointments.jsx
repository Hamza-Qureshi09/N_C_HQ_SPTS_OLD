import React, { useState, useEffect, useRef } from 'react'
import style from './Appointments.module.scss'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from '../../components/Shared/Sidebar/Sidebar'
import Navbar from '../../components/Shared/Navbar/Navbar'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment'
import JoditEditor from 'jodit-react'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import AddIcon from '@mui/icons-material/Add';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import parser from 'html-react-parser'




let AppointementData = {
  Id: "",
  title: "",
  startDate: "",
  endDate: "",
  RequestFrom: "",
  Description: "",
  Role: "",
  Appointmentwith: "",
  Status: ""
};
let makeSysUptodateID;
let Modelrender = false;
function MyVerticallyCenteredModal(props) {
  Modelrender = false;
  const { username } = useSelector((state) => { return state.userAuth })
  const [AllClasses, setAllClasses] = useState([])
  const [AllTeachers, setAllTeachers] = useState([])
  const [NewAppointement, setNewAppointement] = useState(
    {
      Class: "",
      AppointementWith: "",
      startDate: "",
      endDate: "",
      title: ""
    })
  const [Description, setDescription] = useState("")

  const fetchAllClasses = async () => {
    const { data } = await axios.get('/api//Manage/GetClass');
    // console.log(data);
    setAllClasses(data)
  }
  useEffect(() => {
    fetchAllClasses()
    return () => {
    }
  }, [])


  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewAppointement((preVal) => {
      return {
        ...preVal,
        [name]: value
      }
    })
  }
  const submitData = async (e) => {
    e.preventDefault();
    const { Class, AppointementWith, startDate, title, endDate } = NewAppointement;
    // console.log(Class, AppointementWith, AppointementDateTime, Description)
    if (!Class || !AppointementWith || !endDate || !Description || !title || !startDate) {
      return window.alert("Please fill all the fields first!")
    }
    const response = await axios.post("/api/Manage/AppointementAdd", {
      Class, AppointementWith, startDate, Description, title, endDate, RequestFrom: username
    }, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      withCredentials: true
    })
    if (response.status === 200) {
      props.onHide()
      makeSysUptodateID = Class
      return window.alert("Your Appointement is in Pending state.")
    } else {
      return window.alert("Sorry! there is an error.")
    }
  }
  // const config={
  //   buttons:['bold','italic']
  // }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className={style.AddAppointmentsFormTitle}>
          Appointement Request <CalendarMonthOutlinedIcon />
        </Modal.Title>
      </Modal.Header>
      <Form className={style.AddAppointmentsForm} onSubmit={submitData}>
        <Form.Group className="mb-3"  >
          <Form.Label htmlFor='Class'>Class<sup>*</sup></Form.Label>
          <Form.Select aria-label="Default select example" name="Class" onChange={handleInput} id='Class'>
            <option value="">Select Class here...</option>
            {AllClasses.map((val, index, arr) => {
              return (<option value={val.id} key={index}>{val.className}</option>
              )
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3"  >
          <Form.Label htmlFor='AppointementWith'>Appointement With<sup>*</sup></Form.Label>
          <Form.Select aria-label="Default select example" name="AppointementWith" onChange={handleInput} id='AppointementWith' onClick={async (e) => {
            const responce = await axios.get(`/api/Manage/getTeachers/?className=${NewAppointement.Class}`);
            if (responce.status === 200) {
              setAllTeachers(responce.data)
              // console.log(responce.data)
            } else {
              return window.alert("Please select class first!")
            }
          }}>
            <option value="">Select One from the following here...</option>
            <option value="Principle (Admin)">Principle (Admin)</option>
            {AllTeachers.map((val, index, arr) => {
              return (<option value={`${val.Teachers} (Teacher)`} key={index}>{val.Teachers} (Teacher)</option>
              )
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3"   >
          <Form.Label htmlFor='startDate'>Start Date & Time <sup>*</sup></Form.Label>
          <Form.Control
            type="datetime-local"
            onChange={handleInput}
            value={NewAppointement.startDate}
            name="startDate"
            id='startDate' />
        </Form.Group>
        <Form.Group className="mb-3"   >
          <Form.Label htmlFor='endDate'>End Date & Time <sup>*</sup></Form.Label>
          <Form.Control
            type="datetime-local"
            onChange={handleInput}
            value={NewAppointement.endDate}
            name="endDate"
            id='endDate' />
        </Form.Group>
        <Form.Group className="mb-3"   >
          <Form.Label htmlFor='title'>Title of Meeting <sup>*</sup></Form.Label>
          <Form.Control
            type="text"
            placeholder='e.g:(Want to discuss about my child)'
            onChange={handleInput}
            value={NewAppointement.title}
            name="title"
            id='title' />
        </Form.Group>
        <Form.Group className="mb-3"   >
          <Form.Label htmlFor='Description'>Brief Description <sup>*</sup></Form.Label>
          <JoditEditor onChange={(content) => { setDescription(content) }} />

        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal >
  );
}




const DataUPdateModel = ({ AppointementData, onHide }) => {

  const { Id, title, startDate, endDate, RequestFrom, Description, Role, Appointmentwith, Status } = AppointementData;
  // console.log(AppointementData)


  const submitData = async (value) => {
    // update data get function
    if (!value) {
      return window.alert("Please give a responce!")
    }
    const responce = await axios.post("/api/Manage/updateAppointment",
      { Id, value },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        withCredentials: true
      })
    if (responce.status === 200) {
      onHide()
      makeSysUptodateID = title
      return window.alert("successfully updated!");
    } else {
      return window.alert("error in update kindly try again!");
    }
  }

  return (
    <div className={style.MyUpdateCenterModel}>
      <div className={style.fullupdateform}>
        <div className={style.updateForm}>
          <div className={style.Title}>
            <h2>Appointement Request! 📆<span>*</span></h2>
            <CloseRoundedIcon onClick={onHide} className={style.formClose} />
          </div>
          <div className={style.Form}>
            <form className={style.AddAppointmentsForm} >
              <div className={style.inputLayer}>
                <h3>Details</h3>
                <div className={style.details}>
                  <div className={style.infoSection}>
                    <p><b>From:</b> {RequestFrom}</p>
                    <p><b>With:</b> {`${Appointmentwith} (${Role})`}</p>
                    <p><b>Date & Time:</b> {moment(new Date(startDate)).format("yyyy-MM-DD (hh:mm)")} <b>to</b>  {moment(new Date(endDate)).format("yyyy-MM-DD (hh:mm)")}</p>
                    <p><b>Status:</b> {Status}</p>
                    <span><b>Title:</b> <span className={style.h2}>{title}</span></span>
                    <p><b>Description:</b> {parser(Description)}</p>
                  </div>
                  {Status==="Pending"?
                  <div className={style.buttons}>
                  <Button variant="success" onClick={() => { submitData('Approved') }}>
                    Approved
                  </Button>
                  <Button variant="danger" onClick={() => { submitData('Reject') }}>
                    Reject
                  </Button>
                </div>:
                <div className={style.buttons}>
                <Button variant="success" disabled >
                  Approved
                </Button>
                <Button variant="danger" disabled>
                  Reject
                </Button>
              </div>
                }
                </div>
              </div>
            </form>
          </div>
          <div className={style.formCloseBtn}>
            <Button onClick={onHide}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  )
}



const Appointments = () => {
  const { status } = useSelector((state) => { return state.controls })
  const [modalShow, setModalShow] = useState(false);
  const [updateModelShow, setupdateModelShow] = useState(false);
  const [NewAppointement, setNewAppointement] = useState([])
  const Role = localStorage.getItem("Role")
  const locales = {
    "en-US": require("date-fns/locale/en-US")
  }

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  })
  // const localizer = momentLocalizer(moment)

  const ref = useRef()
  ref.current = false
  // update data get function
  const GetAPPointmentInfo = async () => {
    const responce = await axios.get(`/api/Manage/GetAppointements/`)
    if (responce.status === 200) {
      const data = responce.data
      setNewAppointement(data)
    }
  }
  useEffect(() => {
    if (ref.current === true && AppointementData !== undefined) {
      GetAPPointmentInfo()
    }
    return () => {
      ref.current = true
    }
  }, [makeSysUptodateID])


  return (
    <>
      <Navbar />
      <div className={style.AppointmentsDashboardWrapper}>
        <Sidebar ToggleStatus={status} />

        <div className={status ? style.AppointmentsPageSmall : style.AppointmentsPageFull}>


          <div className={style.AppointmentsPageContainer}>
            {Role === "Admin" || Role === "Teacher" ? "" :
              <div className={style.AppointmentsPageTopPart}>
                <Button variant="primary" onClick={() => {
                  setModalShow(true)
                  Modelrender = true
                }}>
                  Add Appointement <AddIcon className={style.btnPlusIcon} />
                </Button>

                {Modelrender === true ? <MyVerticallyCenteredModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                /> : ""}
              </div>
            }

            <div className={style.wrapMidPar}>
              <div className={style.AppointmentsPageMidPart}>
                <h1>Appointements</h1>
                {Role === "Parent" ?
                  <div className={style.table}>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>ID#</th>
                          <th>Title</th>
                          <th>Requested By</th>
                          <th>Appointment with</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {NewAppointement.length === 0 ?
                          <tr>
                            <td colSpan={6}>No Data Found</td>
                          </tr> :
                          NewAppointement.map((val, index, arr) => {
                            if (val !== undefined) {
                              return (
                                <tr key={index}>
                                  <td>{val.id}</td>
                                  <td>{val.title}</td>
                                  <td>{val.RequestFrom}</td>
                                  <td>{val.Appointmentwith}</td>
                                  <td>{moment(new Date(val.startDate)).format("YYYY/MM/DD - hh:mm:ss")} <br /> {moment(new Date(val.endDate)).format("YYYY/MM/DD - hh:mm:ss")} </td>
                                  <td><span className={val.Status === "Approved" ? style.Approved : val.Status === "Pending" ? style.Pending : style.Rejected}>{val.Status}</span></td>
                                </tr>
                              )
                            }

                          })}
                      </tbody>
                    </Table>
                  </div>
                  :

                  <div className={style.table}>
                    <Calendar localizer={localizer}
                      defaultView='day'
                      tooltipAccessor='title'//description
                      selectable={true}
                      resizable={true}
                      popup={true}
                      eventPropGetter={
                        (event, startDate, endDate, isSelected) => {
                          let newStyle = {
                            // backgroundColor: "red",
                            color: 'white',
                            borderRadius: "0px",
                            border: "none"
                          };
                          // console.log(event)
                          if (event.Status === "Approved") {
                            newStyle.backgroundColor = "#157347"
                          } else if (event.Status === "Rejected") {
                            newStyle.backgroundColor = "#dc3545"
                          } else if (event.Role === "Admin") {
                            newStyle.backgroundColor = "#0077ff"
                          } else if (event.Role === "Teacher") {
                            newStyle.backgroundColor = "rebeccapurple"
                          }

                          return {
                            className: "",
                            style: newStyle
                          };
                        }
                      }
                      onSelectEvent={(Appointment) => {
                        AppointementData = Appointment;
                        setupdateModelShow(true)
                      }} // on event click trigger
                      events={NewAppointement.map((val) => {
                        return {
                          startDate: new Date(val.startDate),
                          endDate: new Date(val.endDate),
                          title: val.title,
                          Description: val.Description,
                          Status: val.Status,
                          Role: val.Role,
                          RequestFrom: val.RequestFrom,
                          Appointmentwith: val.Appointmentwith,
                          Id: val.id
                        }
                      })}
                      startAccessor="startDate"
                      endAccessor="endDate" style={{ height: "500px", margin: "5px", backgroundColor: "white" }}

                    />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        {updateModelShow === true ?
          <DataUPdateModel AppointementData={AppointementData} onHide={() => setupdateModelShow(false)} /> : ""}
      </div>
    </>
  )
}

export default Appointments