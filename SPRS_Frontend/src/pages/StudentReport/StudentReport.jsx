import React, { useState, useEffect, useRef } from 'react'
import style from './StudentReport.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { StudentRecordInfo } from '../../store/StudentReport/StudentReport'
import axios from 'axios'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Navbar from '../../components/Shared/Navbar/Navbar'
import Sidebar from '../../components/Shared/Sidebar/Sidebar'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import moment from 'moment'


let UserSearchFor = {};
const Authenticateuser = ({ onHide }) => {

    const [inputVal, setinputVal] = useState({
        ValidEmail: "",
        ValidPassword: ""
    })
    const handleInput = (e) => {
        const { name, value } = e.target;
        setinputVal((preVal) => {
            return {
                ...preVal,
                [name]: value.toLowerCase()
            }
        })
    }

    const dispatch = useDispatch()
    const submitData = async (e) => {
        e.preventDefault()
        const { ValidEmail, ValidPassword } = inputVal
        if (!ValidEmail || !ValidPassword) {
            return window.alert("Missing Information!")
        }
        const response = await axios.post("/api/auth/validateParentSReport", {
            ValidEmail, ValidPassword, UserSearchFor
        }, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            withCredentials: true
        })
        if (response.status === 200) {
            setinputVal({ ValidEmail: "", ValidPassword: "" })
            onHide()
            // console.log(response.data)
            dispatch(StudentRecordInfo(response.data))
            // makeSysUptodateID=inputVal.className
            return window.alert("User Validation Successfully done!")
        }
        return window.alert("Sorry! there is an error.")
    }

    return (
        <div className={style.AuthenticateUserForm}>
            <div className={style.AuthenticationForm}>
                <div className={style.Title}>
                    <h2>Authenticate Yourself <span>*</span></h2>
                    <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                </div>
                <div className={style.Form}>
                    <form className={style.AuthUserFields} onSubmit={submitData}>
                        <div className={style.inputLayer}>
                            <label htmlFor="Email">Email <sup>*</sup></label>
                            <input type="email"
                                id='Email'
                                placeholder="asdf@gmail.com"
                                name='ValidEmail'
                                onChange={handleInput}
                                value={inputVal.ValidEmail}
                            />
                        </div>
                        <div className={style.inputLayer}>
                            <label htmlFor="Password">Password <sup>*</sup></label>
                            <input type="password"
                                id='Password'
                                placeholder="Password"
                                name='ValidPassword'
                                onChange={handleInput}
                                value={inputVal.ValidPassword}
                            />
                        </div>
                        <div className={style.inputLayer}>
                            <Button variant="primary" type="submit" >
                                Validate
                            </Button>
                        </div>
                    </form>
                </div>
                <div className={style.formCloseBtn}>
                    <Button onClick={onHide}>Close</Button>
                </div>
            </div>
        </div>
    )
}







const StudentReport = () => {
    // const Role = localStorage.getItem("Role")
    const { status } = useSelector((state) => { return state.controls })
    const { studentRecord } = useSelector((state) => { return state.studentRecord })
    const [AllClasses, setAllClasses] = useState([])
    const [AllStudents, setAllStudents] = useState([])
    const [AuthenticateUser, setAuthenticateUser] = useState(false)
    // const [AttendenceRecordPdf, setAttendenceRecordPdf] = useState(false)
    const [ViewStudentReport, setViewStudentReport] = useState({
        StudentName: "",
        ClassName: ""
    })

    const ref = useRef()
    ref.current = false

    const loadAllClasses = async () => {
        const { data } = await axios.get('/api/Manage/GetClass')// here fetch all classes first
        setAllClasses(data)
    }

    useEffect(() => {
        if (ref.current === true) {
            loadAllClasses()
        }
        return () => {
            ref.current = true
        }
    }, [])

    const handleInputCreateAtten = (e) => {
        const { name, value } = e.target;
        setViewStudentReport((preval) => {
            return {
                ...preval,
                [name]: value.toLowerCase()
            }
        })
    }

    const handleClassSearchFunc = async () => {
        const { StudentName, ClassName } = ViewStudentReport;
        if (!StudentName || !ClassName) {
            return window.alert("please fill all fields first before creating attendence sheet!")
        }
        UserSearchFor = {
            StudentName: StudentName,
            ClassName: ClassName
        }
        setAuthenticateUser(true)
    }



    // generating pdf
    const generatePDF = async () => {
        const page = document.getElementById("StudentReport")
        const doc = await (await html2canvas(page)).toDataURL("image/png")
        const pdf = new jsPDF({ orientation: 'landscape' });
        let width = pdf.internal.pageSize.getWidth()
        let height = pdf.internal.pageSize.getHeight()
        pdf.addImage(doc, 'PNG', 0, 0, width, height)
        pdf.save('StudentReport.pdf')
    }
    return (
        <>
            <Navbar />
            <div className={style.StudentReportDashboardWrapper}>
                <Sidebar ToggleStatus={status} />

                <div className={status ? style.StudentReportPageSmall : style.StudentReportPageFull}>


                    <div className={style.StudentReportPageContainer}>
                        <div className={style.StudentReportPageTopPart}>
                            <div className={style.leftSide}>
                                <select name="ClassName" onChange={handleInputCreateAtten}>
                                    <option value="">Select Your Class..</option>
                                    {AllClasses.map((val, index, arr) => {
                                        return (
                                            <option value={val.className} key={index}>{val.className}</option>
                                        )
                                    })}
                                </select>
                                <select name="StudentName" onClick={async (e) => {
                                    const responce = await axios.get(`/api/getStudents/?className=${ViewStudentReport.ClassName}`);
                                    if (responce.status === 200) {
                                        setAllStudents(responce.data.Students)
                                    }
                                }} onChange={handleInputCreateAtten}>
                                    <option value="" >Select Student..</option>
                                    {AllStudents.map((val, index, arr) => {
                                        return (
                                            <option value={`${val.Sname} (${val.Srollno})`} key={index}>{`${val.Sname} (${val.Srollno})`}</option>
                                        )
                                    })}
                                </select>
                                <Button variant="primary" type="submit" onClick={handleClassSearchFunc}>
                                    <span>View Report <VisibilityOutlinedIcon /></span>
                                </Button>
                            </div>
                        </div>
                        {studentRecord.length === 0 ? "" :
                            <div className={style.wrapMidPar}>
                                <div className={style.downloadButton} onClick={() => {
                                    generatePDF()
                                }} >
                                    <button ><DownloadIcon className={style.downloadButtonIcon} /></button>
                                </div>
                                <div className={style.StudentReportPageMidPart} >
                                    <h1>Student Report</h1>
                                    <div className={style.StudentReport} id="StudentReport">
                                        <div className={style.TopPart}>
                                            <div className={style.Profile}>
                                                <img src={`/Storage/Students/${studentRecord.StudentPicture}`} alt="not found" />
                                            </div>
                                            <div className={style.GeneralInfo}>
                                                <h1>{studentRecord.StudentName}</h1>
                                                <b>Rollno: {studentRecord.Rollno}</b>
                                                <b>Class: {studentRecord.Class}</b>
                                            </div>
                                        </div>
                                        <div className={style.MidPart}>
                                            <div className={style.leftInfoPart}>
                                                <h2>Person Information</h2>
                                                <span>
                                                    <p><b>Addresss:</b> <span>{studentRecord.StudentAddress}</span></p>
                                                    <p><b>Birth Date:</b> <span> {moment(new Date(studentRecord.Birthdate)).format("YYYY/MM/DD")}</span></p>
                                                    <p><b>Phone no:</b> <span>{studentRecord.StudentPhone}</span></p>
                                                    <p><b>Gender:</b> <span>{studentRecord.Gender}</span></p>
                                                </span>
                                            </div>
                                            <div className={style.RightInfoPart}>
                                                <h2>School Information</h2>
                                                <span>
                                                    <p><b>Roll No:</b> <span>{studentRecord.Rollno}</span></p>
                                                    <p><b>Class:</b> <span>{studentRecord.Class}</span></p>
                                                    <p><b>Unique ID#:</b> <span>{studentRecord.id}</span></p>
                                                    <p><b>Parent Info:</b> <span>{studentRecord.ParentInfo.split("\n")[0]} <br /> {studentRecord.ParentInfo.split("\n")[1]}</span></p>
                                                </span>
                                            </div>
                                        </div>
                                        <div className={style.BottomPart}>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>Class</th>
                                                        <th>Exam Title</th>
                                                        <th>Subject</th>
                                                        <th>Total Marks</th>
                                                        <th>Marks Obtain</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {studentRecord.StudentMarks.map((val, index) => {
                                                        return (
                                                            <tr key={val._id}>
                                                                <td>{val.Class}</td>
                                                                <td>{val.Title}</td>
                                                                <td>{val.Subject}</td>
                                                                <td>{val.TotalMarks}</td>
                                                                <td>{val.ObtainMarks}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
              
                {AuthenticateUser === true ?
                    <Authenticateuser onHide={() => setAuthenticateUser(false)} /> : ""
                }
            </div>

          

        </>

    )
}

export default StudentReport;