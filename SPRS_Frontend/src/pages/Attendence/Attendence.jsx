import React, { useState, useEffect, useRef } from 'react'
import style from './Attendence.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { StudentsAttendence, MarkedStudents } from '../../store/attendenceRecord/attendenceRecord'
import axios from 'axios'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Sidebar from '../../components/Shared/Sidebar/Sidebar'
import Navbar from '../../components/Shared/Navbar/Navbar'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';
import moment from 'moment'


let findClass;
const Authenticateuser = ({ onHide }) => {
    const { role } = useSelector((state) => { return state.userAuth })
    // console.log(role,findClass)
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
        if (!ValidEmail || !ValidPassword || !role) {
            return window.alert("Please Fill all the fields for Authentication")
        }
        const response = await axios.post("/api/auth/userValidation/Attendence", {
            ValidEmail, ValidPassword, role, findClass
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
            dispatch(StudentsAttendence(response.data))
            // makeSysUptodateID=inputVal.className
            return window.alert("User Validation Successfully done!")
        } else {
            return window.alert("Sorry! there is an error.")
        }
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







const Attendence = () => {
    const Role = localStorage.getItem("Role")
    const { status } = useSelector((state) => { return state.controls })
    const [AllClasses, setAllClasses] = useState([])
    const [AllStudents, setAllStudents] = useState([])
    const [AuthenticateUser, setAuthenticateUser] = useState(false)
    const [AttendenceRecordPdf, setAttendenceRecordPdf] = useState(false)
    const [createAttendenceState, setcreateAttendenceState] = useState({
        createAttendenceDate: "",
    })
    const [viewAttendenceState, setviewAttendenceState] = useState({
        ClassName: "",
    })
    const [selectedStudent, setselectedStudent] = useState("")
    const [SingleStudentInfo, setSingleStudentInfo] = useState([])
    const [StudentsAttendenceData, setStudentsAttendenceData] = useState({
        studentRollno: "",
        studentName: "",
        className: "",
        AttendenceVal: "",
    })
    const dispatch = useDispatch()
    const { students } = useSelector((state) => { return state.attendenceRecord })
    const { markedStudentsArr } = useSelector((state) => { return state.attendenceRecord })
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
        setcreateAttendenceState((preval) => {
            return {
                ...preval,
                [name]: value.toLowerCase()
            }
        })
    }

    const handleClassSearchFunc = async () => {
        const { createAttendenceDate, createAttendenceClass } = createAttendenceState;
        if (!createAttendenceDate || !createAttendenceClass) {
            return window.alert("please fill all fields first before creating attendence sheet!")
        }
        findClass = createAttendenceClass;
        setAuthenticateUser(true)
    }

    const handleAttendenceChange = async (e) => {
        const { name, value } = e.target;
        setStudentsAttendenceData((preVal) => {
            return {
                ...preVal,
                [name]: value.toLowerCase()
            }
        })
    }


    // generating pdf
    const generatePDF = async () => {
        const page = document.getElementById("AttendenceSheet")
        const doc = await (await html2canvas(page)).toDataURL("image/png")
        const pdf = new jsPDF("p", "pt", "a4");
        // let width = pdf.internal.pageSize.getWidth()
        // let height = pdf.internal.pageSize.getHeight()
        pdf.addImage(doc, 'PNG', 0, 0)
        pdf.save('Attendence.pdf')
        // doc.html((document.getElementById("AttendenceSheet")), {
        //     callback: function (pdf) {
        //         pdf.save("AtetndenceSheet.pdf")
        //     }
        // })
    }
// console.log()
    return (
        <>
            <Navbar />
            <div className={style.SubjectDashboardWrapper}>
                <Sidebar ToggleStatus={status} />

                <div className={status ? style.SubjectPageSmall : style.SubjectPageFull}>


                    <div className={style.SubjectPageContainer}>
                        <div className={style.SubjectPageTopPart}>
                            <div className={style.leftSide}>
                                <select name="ClassName" onChange={(e) => { setviewAttendenceState({ ClassName: e.target.value }) }} >
                                    <option value="">Select Your Class..</option>
                                    {AllClasses.map((val, index, arr) => {
                                        return (
                                            <option value={val.className} key={index}>{val.className}</option>
                                        )
                                    })}
                                </select>
                                <select name="StudentName" onClick={async(e) => {
                                    const responce=await axios.get(`/api/getStudents/?className=${viewAttendenceState.ClassName}`);
                                    if(responce.status===200){
                                        setAllStudents(responce.data.Students)
                                    }
                                     }} onChange={(e)=>{setselectedStudent(e.target.value ) }}>
                                    <option value="" >Select Student..</option>
                                    {AllStudents.map((val, index, arr) => {
                                        return (
                                            <option value={`${val.Sname} (${val.Srollno})`} key={index}>{`${val.Sname} (${val.Srollno})`}</option>
                                        )
                                    })}
                                </select>
                                <Button variant="primary" type="submit" onClick={async(e)=>{e.preventDefault();
                                const responce=await axios.get(`/api/getSingleStudentInfo/?studentname=${selectedStudent}`);
                                if(responce.status===200){
                                    setSingleStudentInfo(responce.data)
                                    setAttendenceRecordPdf(true)
                                }}}>
                                    <span>View Attendence <VisibilityOutlinedIcon /></span>
                                </Button>
                            </div>
                            {Role === "Admin" ?
                                ""
                                :
                                <div className={style.rightSide}>
                                    {/* <h1>Create Attendence Here..</h1> */}
                                    <input type="date" onChange={handleInputCreateAtten} name="createAttendenceDate" />
                                    <select name="createAttendenceClass" onChange={handleInputCreateAtten} >
                                        <option value="">Select Your Class..</option>
                                        {AllClasses.map((val, index, arr) => {
                                            return (
                                                <option value={val.className} key={index}>{val.className}</option>
                                            )
                                        })}
                                    </select>
                                    <Button variant="primary" type="submit" onClick={handleClassSearchFunc} >
                                        <span>Create Attendence <AddBoxOutlinedIcon /></span>

                                    </Button>
                                </div>
                            }

                        </div>
                        {students.length > 0 && Role === "Teacher" ?
                            <div className={style.wrapMidPar}>
                                <div className={style.SubjectPageMidPart}>
                                    <h1>Students</h1>
                                    <div className={style.table}>

                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>ID#</th>
                                                    <th>Picture</th>
                                                    <th>Student Name</th>
                                                    <th>Student Roll No</th>
                                                    <th>Present</th>
                                                    <th>Absent</th>
                                                    <th>Leave</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.length === 0 ?
                                                    <tr>
                                                        <td colSpan={8}>No Data Found</td>
                                                    </tr> :
                                                    students.map((val, index, arr) => {
                                                        if (val !== undefined) {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{val.id}</td>
                                                                    <td className={style.imageShape}>{val.StudentPicture ? <img src={`/Storage/Students/${val.StudentPicture}`} alt="not found" /> : <img alt="not found" />}</td>
                                                                    <td>{val.StudentName}</td>
                                                                    <td>{val.StudentRollno}</td>
                                                                    <td>
                                                                        <input type="radio"
                                                                            name="AttendenceVal"
                                                                            onChange={handleAttendenceChange}
                                                                            value="Present" />
                                                                        <label htmlFor="Present">Present</label>
                                                                    </td>
                                                                    <td>
                                                                        <input type="radio"
                                                                            name="AttendenceVal"
                                                                            onChange={handleAttendenceChange}
                                                                            value="Absent" />
                                                                        <label htmlFor="Absent">Absent</label>
                                                                    </td>
                                                                    <td>  <input type="radio"
                                                                        name="AttendenceVal"
                                                                        onChange={handleAttendenceChange}
                                                                        value="Leave" />
                                                                        <label htmlFor="Leave">Leave</label></td>
                                                                    <td>
                                                                        {markedStudentsArr.includes(val.id) ?
                                                                            <>
                                                                                <Button disabled  >Submit</Button>
                                                                            </> :
                                                                            <Button
                                                                                onClick={async () => {
                                                                                    if (StudentsAttendenceData.AttendenceVal) {
                                                                                        const response = await axios.post("/api/auth/MarkAttendence", {
                                                                                            status: StudentsAttendenceData.AttendenceVal, Id: val.id
                                                                                        }, {
                                                                                            headers: {
                                                                                                "Content-Type": "application/json",
                                                                                                Accept: "application/json"
                                                                                            },
                                                                                            withCredentials: true
                                                                                        })
                                                                                        if (response.status === 200) {
                                                                                            dispatch(MarkedStudents([...markedStudentsArr, val.id]))
                                                                                            window.alert("marked")
                                                                                            StudentsAttendenceData.AttendenceVal = "";
                                                                                        } else {
                                                                                            console.log("not marked")
                                                                                        }
                                                                                    } else {
                                                                                        window.alert("Mark Attendence First!!!")
                                                                                    }
                                                                                }}
                                                                            >Submit</Button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }

                                                    })}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                            : ""}
                    </div>
                </div>
                {/* {updateModelShow === true ?
                <DataUPdateModel Id={findClass} onHide={() => setupdateModelShow(false)} /> : ""} */}
                {AuthenticateUser === true ?
                    <Authenticateuser onHide={() => setAuthenticateUser(false)} /> : ""
                }
            </div>

            {/* generating attendence pdf file */}
            {AttendenceRecordPdf ?
                <div className={style.AttendenceSheetPdfContainer}>
                    <div className={style.downloadButton} onClick={() => {
                        generatePDF()
                        setAttendenceRecordPdf(false)
                    }} >
                        <button ><DownloadIcon className={style.downloadButtonIcon} /></button>
                    </div>
                    <div className={style.goBackButton}>
                        <ClearIcon className={style.cancleButton} onClick={() => { return setAttendenceRecordPdf(false) }} />
                    </div>
                    <div className={style.AtendencePdfFile} id="AttendenceSheet">
                        <div className={style.PdfFileFormat}>
                            <div className={style.topPortion}>
                                <div className={style.topPartOne}>
                                    <div className={style.info}>
                                        <p><b>Authority: </b>Teacher</p>
                                        <p><b>Name: </b>Hamza Qureshi</p>
                                    </div>
                                    <div className={style.date}>
                                        <b>Date: </b> <p> {moment(new Date(Date.now())).format("YYYY/MM/DD")}</p>
                                    </div>
                                </div>
                                <div className={style.topPartTwo}>
                                    <div className={style.profile}>
                                        <img src="/images/hamza.jpg" alt="not found" />
                                    </div>
                                    <div className={style.title}>
                                        Muhammad Nawaz Shrief University of Agriculture
                                    </div>
                                    <div className={style.address}>
                                        <p>Multan Pakistan</p>
                                        <p>hamzaqursehi2909@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className={style.MidPortion}>
                                <b>Attendence cheet sheet</b>
                                <div className={style.AttendenceTable}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Roll no.</th>
                                                <th>Presents</th>
                                                <th>Leaves</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>{SingleStudentInfo.StudentName}</td>
                                                <td>{SingleStudentInfo.StudentRollno}</td>
                                                <td>{SingleStudentInfo.Presents?`${SingleStudentInfo.Presents}/30`:""}</td>
                                                <td><p><b>2 Leaves</b> <br /> Dates</p></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={style.BottomPortion}>
                                <div className={style.Precautions}>
                                    <sup>*</sup> <b> Attendence sheet to track your student progress.</b> <sup>*</sup>
                                </div>
                                <div className={style.signature}>
                                    <h2>Hamza Qureshi</h2>
                                    <b>Signature</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : ""}

        </>

    )
}

export default Attendence;