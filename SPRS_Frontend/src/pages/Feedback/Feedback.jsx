import React, { useState, useEffect, useRef } from 'react'
import style from './Feedback.module.scss'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from '../../components/Shared/Sidebar/Sidebar'
import Navbar from '../../components/Shared/Navbar/Navbar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import JoditEditor from 'jodit-react'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import parser from 'html-react-parser'





let makeSysUptodateID;
let Modelrender = false;
function MyVerticallyCenteredModal(props) {
    Modelrender = false;
    const { username } = useSelector((state) => { return state.userAuth })
    const [AllClasses, setAllClasses] = useState([])
    const [AllStudents, setAllStudents] = useState([])
    const [AllSubjects, setAllSubjects] = useState([])
    const [NewFeedback, setNewFeedback] = useState(
        {
            Class: "",
            Student: "",
            Subject: "",
        })
    const [FeedbackDescription, setFeedbackDescription] = useState("")

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
        setNewFeedback((preVal) => {
            return {
                ...preVal,
                [name]: value
            }
        })
    }
    const submitData = async (e) => {
        e.preventDefault();
        const { Class, Student, Subject } = NewFeedback;
        // console.log(Class, Student, LeaveDateTime, FeedbackDescription)
        if (!Class || !Student || !Subject || !FeedbackDescription ||!username) {
            return window.alert("Please fill all the fields first!")
        }
        const response = await axios.post("/api/Manage/AddNewFeedback", {
            Class, Student, Subject, FeedbackDescription,username
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
            return window.alert("Your Feedback successfully submitted.")
        } else {
            return window.alert("Sorry! there is an error.")
        }
    }

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
                        const responce = await axios.get(`/api/Manage/FeedbackStudents/?className=${NewFeedback.Class}`);
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

                <Form.Group className="mb-3"  >
                    <Form.Label htmlFor='Subject'>Subject<sup>*</sup></Form.Label>
                    <Form.Select aria-label="Default select example" name="Subject" onChange={handleInput} id='Subject' onClick={async (e) => {
                        const responce = await axios.get(`/api/Manage/FeedbackSubjects/?className=${NewFeedback.Class}`);
                        if (responce.status === 200) {
                            setAllSubjects(responce.data)
                            // console.log(responce.data)
                        } else {
                            return window.alert("Please select class first!")
                        }
                    }}>
                        <option value="">Select One from the following here...</option>
                        {AllSubjects.map((val, index, arr) => {
                            return (<option value={`${val.Subjectname} `} key={index}>{val.Subjectname} (Subject)</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='FeedbackDescription'>Write Feedback<sup>*</sup></Form.Label>
                    <JoditEditor onChange={(content) => { setFeedbackDescription(content) }} />

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







const Feedback = () => {
    const { status } = useSelector((state) => { return state.controls })
    const [modalShow, setModalShow] = useState(false);
    const [NewFeedback, setNewFeedback] = useState([])
    const Role = localStorage.getItem("Role")


    const ref = useRef()
    ref.current = false
    // update data get function
    const GetFeedbackInfo = async () => {
        const responce = await axios.get(`/api/Manage/GetFeedbacks`)
        if (responce.status === 200) {
            const data = responce.data
            setNewFeedback(data)
        }
    }
    useEffect(() => {
        if (ref.current === true) {
            GetFeedbackInfo()
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
                                    Add Feedback <AddIcon className={style.btnPlusIcon} />
                                </Button>

                                {Modelrender === true ? <MyVerticallyCenteredModal
                                    show={modalShow}
                                    onHide={() => setModalShow(false)}
                                /> : ""}
                            </div>
                        }

                        <div className={style.wrapMidPar}>
                            <div className={style.LeavePageMidPart}>
                                <h1>Feedbacks</h1>
                                <div className={style.table}>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>ID#</th>
                                                <th>Class</th>
                                                <th>Student</th>
                                                <th>Subject</th>
                                                <th>Parent</th>
                                                <th>Feedback</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {NewFeedback.length === 0 ?
                                                <tr>
                                                    <td colSpan={6}>No Data Found</td>   
                                                </tr> :
                                                NewFeedback.map((val, index, arr) => {
                                                    if (val !== undefined) {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{val.id}</td>
                                                                <td>{val.Class}</td>
                                                                <td>{val.Student}</td>
                                                                <td>{`${val.Subject} `}</td>
                                                                <td>{val.ParentInfo} </td>
                                                                <td>{parser(val.Feedback)} </td>
                                                              
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
            </div>
        </>
    )
}

export default Feedback