import React, { useState, useEffect, useRef } from 'react'
import style from './Leave.module.scss'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from '../../components/Shared/Sidebar/Sidebar'
import Navbar from '../../components/Shared/Navbar/Navbar'
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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import parser from 'html-react-parser'




let LeaveData = {
    id: "",
    title: "",
    startDate: "",
    endDate: "",
    RequestedBy: "",
    DetailApplication: "",
    Class: "",
    Student: "",
    Status: ""
};
let makeSysUptodateID;
let Modelrender = false;
function MyVerticallyCenteredModal(props) {
    Modelrender = false;
    const { username } = useSelector((state) => { return state.userAuth })
    const [AllClasses, setAllClasses] = useState([])
    const [AllStudents, setAllStudents] = useState([])
    const [NewLeave, setNewLeave] = useState(
        {
            Class: "",
            Student: "",
            startDate: "",
            endDate: "",
            title: ""
        })
    const [DetailApplication, setDetailApplication] = useState("")

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
        setNewLeave((preVal) => {
            return {
                ...preVal,
                [name]: value
            }
        })
    }
    const submitData = async (e) => {
        e.preventDefault();
        const { Class, Student, startDate, title, endDate } = NewLeave;
        // console.log(Class, Student, LeaveDateTime, DetailApplication)
        if (!Class || !Student || !endDate || !DetailApplication || !title || !startDate) {
            return window.alert("Please fill all the fields first!")
        }
        const response = await axios.post("/api/Manage/LeaveAdd", {
            Class, Student, startDate, DetailApplication, title, endDate, RequestedBy: username
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
            return window.alert("Your Leave is in Pending state.")
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
                <Modal.Title id="contained-modal-title-vcenter" className={style.AddLeaveFormTitle}>
                    Leave Request <CalendarMonthOutlinedIcon />
                </Modal.Title>
            </Modal.Header>
            <Form className={style.AddLeaveForm} onSubmit={submitData}>
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
                    <Form.Label htmlFor='Student'>Student<sup>*</sup></Form.Label>
                    <Form.Select aria-label="Default select example" name="Student" onChange={handleInput} id='Student' onClick={async (e) => {
                        const responce = await axios.get(`/api/Manage/getStudents/?className=${NewLeave.Class}`);
                        if (responce.status === 200) {
                            setAllStudents(responce.data)
                            // console.log(responce.data)
                        } else {
                            return window.alert("Please select class first!")
                        }
                    }}>
                        <option value="">Select One from the following here...</option>
                        {AllStudents.map((val, index, arr) => {
                            return (<option value={`${val.Students} , ${val.StudentRollno}`} key={index}>{val.Students} (Student)</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='startDate'>Start Date & Time <sup>*</sup></Form.Label>
                    <Form.Control
                        type="date"
                        onChange={handleInput}
                        value={NewLeave.startDate}
                        name="startDate"
                        id='startDate' />
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='endDate'>End Date & Time <sup>*</sup></Form.Label>
                    <Form.Control
                        type="date"
                        onChange={handleInput}
                        value={NewLeave.endDate}
                        name="endDate"
                        id='endDate' />
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='title'>Title of Leave <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder='e.g:(My child suffuring from disease)'
                        onChange={handleInput}
                        value={NewLeave.title}
                        name="title"
                        id='title' />
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='DetailApplication'>Brief Details<sup>*</sup></Form.Label>
                    <JoditEditor onChange={(content) => { setDetailApplication(content) }} />

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




const DataUPdateModel = ({ LeaveData, onHide }) => {
    const { id, title, startDate, endDate, RequestedBy, DetailApplication, Class, Student, Status } = LeaveData;
    const Role=localStorage.getItem("Role")


    const submitData = async (value) => {
        // update data get function
        if (!value) {
            return window.alert("Please give a responce!")
        }
        const responce = await axios.post("/api/Manage/updateLeave",
            { id, value,Role },
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
                        <h2>Leave Request! 📆<span>*</span></h2>
                        <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                    </div>
                    <div className={style.Form}>
                        <form className={style.AddLeaveForm} >
                            <div className={style.inputLayer}>
                                <h3>Details</h3>
                                <div className={style.details}>
                                    <div className={style.infoSection}>
                                        <p><b>From:</b> {RequestedBy}</p>
                                        <p><b>With:</b> {`${Student[0].Studentname} ${Student[0].StudentRollno}`}</p>
                                        <p><b>Class:</b> {`(${Class})`}</p>
                                        <p><b>Date & Time:</b> {moment(new Date(startDate)).format("yyyy-MM-DD ")} <b>to</b>  {moment(new Date(endDate)).format("yyyy-MM-DD")}</p>
                                        <p><b>Status:</b> {Status}</p>
                                        <span><b>Title:</b> <span className={style.h2}>{title}</span></span>
                                        <p><b>DetailApplication:</b> {parser(DetailApplication)}</p>
                                    </div>
                                    {Status === "Pending" ?
                                        <div className={style.buttons}>
                                            <Button variant="success" onClick={() => { submitData('Approved') }}>
                                                Approved
                                            </Button>
                                            <Button variant="danger" onClick={() => { submitData('Reject') }}>
                                                Reject
                                            </Button>
                                        </div> :
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



const Leave = () => {
    const { status } = useSelector((state) => { return state.controls })
    const [modalShow, setModalShow] = useState(false);
    const [updateModelShow, setupdateModelShow] = useState(false);
    const [NewLeave, setNewLeave] = useState([])
    const Role = localStorage.getItem("Role")


    const ref = useRef()
    ref.current = false
    // update data get function
    const GetLeaveInfo = async () => {
        const responce = await axios.get(`/api/Manage/GetLeaves`)
        if (responce.status === 200) {
            const data = responce.data
            setNewLeave(data)
        }
    }
    useEffect(() => {
        if (ref.current === true && LeaveData !== undefined) {
            GetLeaveInfo()
        }
        return () => {
            ref.current = true
        }
    }, [makeSysUptodateID])


    return (
        <>
            <Navbar />
            <div className={style.LeaveDashboardWrapper}>
                <Sidebar ToggleStatus={status} />

                <div className={status ? style.LeavePageSmall : style.LeavePageFull}>


                    <div className={style.LeavePageContainer}>
                        {Role === "Admin" || Role === "Teacher" ? "" :
                            <div className={style.LeavePageTopPart}>
                                <Button variant="primary" onClick={() => {
                                    setModalShow(true)
                                    Modelrender = true
                                }}>
                                    Add Leave <AddIcon className={style.btnPlusIcon} />
                                </Button>

                                {Modelrender === true ? <MyVerticallyCenteredModal
                                    show={modalShow}
                                    onHide={() => setModalShow(false)}
                                /> : ""}
                            </div>
                        }

                        <div className={style.wrapMidPar}>
                            <div className={style.LeavePageMidPart}>
                                <h1>Leave Status</h1>
                                <div className={style.table}>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>ID#</th>
                                                <th>Title</th>
                                                <th>Requested By</th>
                                                <th>Child</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {NewLeave.length === 0 ?
                                                <tr>
                                                    <td colSpan={6}>No Data Found</td>
                                                </tr> :
                                                NewLeave.map((val, index, arr) => {
                                                    if (val !== undefined) {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{val.id}</td>
                                                                <td>{val.title}</td>
                                                                <td>{val.RequestedBy}</td>
                                                                <td>{`${val.Student[0].Studentname} (${val.Student[0].StudentRollno} )`}</td>
                                                                <td>{moment(new Date(val.startDate)).format("YYYY/MM/DD ")} <br /> {moment(new Date(val.endDate)).format("YYYY/MM/DD")} </td>
                                                                {Role === "Parent" ? <td><span className={val.Status === "Approved" ? style.Approved : val.Status === "Pending" ? style.Pending : style.Rejected}>{val.Status}</span></td>
                                                                    : <td className={style.LeaveButtons}>
                                                                        <Button variant="primary" onClick={() => {
                                                                             LeaveData = val;
                                                                             setupdateModelShow(true)
                                                                        }}>
                                                                            View  <VisibilityOutlinedIcon className={style.btnViewIcon}/>
                                                                        </Button>
                                                                    </td>
                                                                }
                                                            </tr>
                                                        )
                                                    }
                                                })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {updateModelShow === true ?
                    <DataUPdateModel 
                    LeaveData={LeaveData} 
                    onHide={() => setupdateModelShow(false)} /> : ""}
            </div>
        </>
    )
}

export default Leave