import React, { useState, useEffect, useRef } from 'react'
import style from './Student.module.scss'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from '../../../components/Shared/Sidebar/Sidebar'
import Navbar from '../../../components/Shared/Navbar/Navbar'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import AddIcon from '@mui/icons-material/Add';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import moment from "moment"




let classID;
let Modelrender = false;
let makeSysUptodateID;
function MyVerticallyCenteredModal(props) {
    const [AllClasses, setAllClasses] = useState([])
    const [AllParents, setAllParents] = useState([])
    const [ParentInfo, setParentInfo] = useState("hide")
    const [activeGender, setactiveGender] = useState("hide")
    const [activeParent, setactiveParent] = useState("hide")
    const [activeFee, setactiveFee] = useState("hide")
    const [FeePaidOrNot, setFeePaidOrNot] = useState("hide")
    const [imageSelct, setimageSelct] = useState("")
    Modelrender = false;
    const [inputVal, setinputVal] = useState({
        StudentName: "",
        StudentRollno: "",
        StudentAddress: "",
        StudnetBirthdate: "",
        StudnetPhone: "",
        Gender: "",
        ParentStatus: "",
        ParentName: "",
        ParentEmail: "",
        SetParentPassword: "",
        ParentAlreadyExistName: "",
        Class: "",
        FeeStatus: "",
        Amount: "",
        StudentPicture: "",
    })

    const handleFile = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setimageSelct(reader.result)
        }
    }

    const fetchAllClasses = async () => {
        const { data } = await axios.get('/api/Manage/GetClass');
        const ParentsResponce = await axios.get('/api//Manage/GetParents');
        // console.log(data);
        setAllClasses(data)
        setAllParents(ParentsResponce.data)
    }
    useEffect(() => {
        fetchAllClasses()
        return () => {
        }
    }, [])

    const handleInput = (e) => {
        const { name, value } = e.target;
        setinputVal((preVal) => {
            return {
                ...preVal,
                [name]: value.toLowerCase()
            }
        })
    }


    const submitData = async (e) => {
        e.preventDefault();
        const { StudentName, StudentRollno, StudentAddress, StudnetBirthdate, StudnetPhone, Gender, ParentStatus, ParentName, ParentEmail, SetParentPassword, ParentAlreadyExistName, Class, FeeStatus, Amount } = inputVal;

        if (!StudentName || !StudentRollno || !StudentAddress || !StudnetBirthdate || !Gender || !ParentStatus || !Class || !FeeStatus) {
            return window.alert("Please fill all the fields first!")
        }

        const response = await axios.post("/api/Manage/AddStudent", {
            StudentName, StudentRollno, StudentAddress, StudnetBirthdate, StudnetPhone, Gender, ParentStatus, ParentName, ParentEmail, SetParentPassword, ParentAlreadyExistName, Class, FeeStatus, Amount, StudentImage: imageSelct ? imageSelct : ""
        }, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            withCredentials: true
        })
        if (response.status === 200) {
            setinputVal({ className: "", Fee: "" })
            props.onHide()
            makeSysUptodateID = StudentName
            return window.alert("Student added successfully!")
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
                <Modal.Title id="contained-modal-title-vcenter" className={style.AddStudentFormTitle}>
                    Add Student
                    {/* <span>(For example 1,2,3-A,etc...)</span> */}
                </Modal.Title>
            </Modal.Header>
            <Form className={style.AddStudentForm} onSubmit={submitData}>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='StudentName'>Studnet Name <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Student name"
                        onChange={handleInput}
                        value={inputVal.StudentName}
                        name="StudentName"
                        id='StudentName' />
                </Form.Group>

                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='StudentRollno'>Studnet Roll no <sup>*</sup></Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="2022-50"
                        onChange={handleInput}
                        value={inputVal.StudentRollno}
                        name="StudentRollno"
                        id='StudentRollno' />
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='StudentAddress'>Studnet Address <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Address here.."
                        onChange={handleInput}
                        value={inputVal.StudentAddress}
                        name="StudentAddress"
                        id='StudentAddress' />
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='StudnetBirthdate'>Studnet Birthdate <sup>*</sup></Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="Enter Subject name"
                        onChange={handleInput}
                        value={inputVal.StudnetBirthdate}
                        name="StudnetBirthdate"
                        id='StudnetBirthdate' />
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='StudnetPhone'>Studnet Phone <sup>(optional)</sup></Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="+923170816287"
                        onChange={handleInput}
                        value={inputVal.StudnetPhone}
                        name="StudnetPhone"
                        id='StudnetPhone' />
                </Form.Group>
                <Form.Group className={style.studentFormAlign} >
                    <b>Gender</b> <sup>*</sup>
                    <div className={style.studentFormAlignItems}>
                        <div className={style.studentformAlignitem}>
                            <Form.Label htmlFor='male'>Male </Form.Label>
                            <Form.Control className={`${activeGender === "true" ? style.activeGenderRadio : ""}`}
                                type="radio"
                                value="male"
                                name="Gender"
                                onChange={handleInput}
                                onClick={() => setactiveGender("true")}
                                id='male' />
                        </div>
                        <div className={style.studentformAlignitem}>
                            <Form.Label htmlFor='female'>Female</Form.Label>
                            <Form.Control className={`${activeGender === "false" ? style.activeGenderRadio : ""}`}
                                type="radio"
                                value="female"
                                name="Gender"
                                onChange={handleInput}
                                onClick={() => setactiveGender("false")}
                                id='female' />
                        </div>
                    </div>

                </Form.Group>

                <Form.Group className={style.studentFormAlign}  >
                    <div className={style.studentFormAlignItems}>
                        <div className={style.studentformAlignitem}>
                            <Form.Label htmlFor='Parentalreadyregistered'>Parent already registered ?</Form.Label>
                            <Form.Control className={`${activeParent === "true" ? style.activeParentRadio : ""}`}
                                type="radio"
                                id='Parentalreadyregistered'
                                onChange={handleInput}
                                value="parentexist"
                                name="ParentStatus"
                                onClick={() => {
                                    setactiveParent("true")
                                    setParentInfo("selectParent")
                                }} />
                        </div>

                        <div className={style.studentformAlignitem}>
                            <Form.Label htmlFor='newparent'>New Parent Registration ?</Form.Label>
                            <Form.Control className={`${activeParent === "false" ? style.activeParentRadio : ""}`}
                                type="radio"
                                id='newparent'
                                value="newparent"
                                onChange={handleInput}
                                name="ParentStatus"
                                onClick={() => {
                                    setactiveParent("false")
                                    setParentInfo("takeParentInfo")
                                }} />
                        </div>
                    </div>
                </Form.Group>

                {ParentInfo === "takeParentInfo" ?
                    <>
                        <Form.Group className="mb-3"   >
                            <Form.Label htmlFor='ParentName'>Parent Name <sup>*</sup></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Parent name"
                                onChange={handleInput}
                                value={inputVal.ParentName}
                                name="ParentName"
                                id='ParentName' />
                        </Form.Group>
                        <Form.Group className="mb-3"   >
                            <Form.Label htmlFor='ParentEmail'>Parent Email <sup>*</sup></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="asdf@gmail.com"
                                onChange={handleInput}
                                value={inputVal.ParentEmail}
                                name="ParentEmail"
                                id='ParentEmail' />
                        </Form.Group>
                        <Form.Group className="mb-3"   >
                            <Form.Label htmlFor='ParentPassword'>Set Parent Password <sup>*</sup></Form.Label>
                            <Form.Control
                                type="password"
                                onChange={handleInput}
                                value={inputVal.SetParentPassword}
                                name="SetParentPassword"
                                id='ParentPassword' />
                        </Form.Group>
                    </>
                    : ParentInfo === "selectParent" ?
                        <>
                            <Form.Group className="mb-3"  >
                                <Form.Label htmlFor='Parentselect'>Select Parent<sup>*</sup></Form.Label>
                                <Form.Select name="ParentAlreadyExistName" onChange={handleInput} id='Parentselect'>
                                    <option>Select Parent here...</option>
                                    {AllParents.map((val, index, arr) => {
                                        return (<option value={val.Pname} key={index}>{val.Pname} {val.Pemail}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </>
                        : ""
                }

                <Form.Group className="mb-3"  >
                    <Form.Label htmlFor='Class'>Student Class<sup>*</sup></Form.Label>
                    <Form.Select aria-label="Default select example" name="Class" onChange={handleInput} id='Class'>
                        <option>Select Class here...</option>
                        {AllClasses.map((val, index, arr) => {
                            return (<option value={val.className} key={index}>{val.className}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>



                <Form.Group className={style.studentFormAlign}   >
                    <div className={style.studentFormAlignItems}>
                        <div className={style.studentformAlignitem}>
                            <Form.Label htmlFor='FeePaid'>Fee Paid <sup>*</sup></Form.Label>
                            <Form.Control className={`${activeFee === "true" ? style.activeFeeRadio : ""}`}
                                type="radio"
                                value="paid"
                                name="FeeStatus"
                                onChange={handleInput}
                                onClick={() => {
                                    setactiveFee("true")
                                    setFeePaidOrNot("true")
                                }}
                                id='FeePaid' />
                        </div>
                        <div className={style.studentformAlignitem}>
                            <Form.Label htmlFor='notpaid'>not paid <sup>*</sup></Form.Label>
                            <Form.Control className={`${activeFee === "false" ? style.activeFeeRadio : ""}`}
                                type="radio"
                                value="Notpaid"
                                name="FeeStatus"
                                onChange={handleInput}
                                onClick={() => {
                                    setactiveFee("false")
                                    setFeePaidOrNot("false")
                                }}
                                id='notpaid' />
                        </div>
                    </div>
                </Form.Group>
                {FeePaidOrNot === "true" ?
                    <>
                        <Form.Group className="mb-3"   >
                            <Form.Label htmlFor='StudentFeeAmount'>Amount <sup>*</sup></Form.Label>
                            <Form.Control
                                type="number"
                                onChange={handleInput}
                                value={inputVal.Amount}
                                name="Amount"
                                id='StudentFeeAmount' />
                        </Form.Group>
                    </> : ""}

                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='StudentPicture'>Student Picture <sup>(optional)</sup></Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFile}
                        accept="image/png , image/jpg , image/jpeg"
                        id='StudentPicture' />
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



const DataUPdateModel = ({ Id, onHide }) => {
    const [imageSelct, setimageSelct] = useState("")
    const [AllClasses, setAllClasses] = useState([])
    const [inputVal, setinputVal] = useState({
        StudentName: "",
        StudentRollno: "",
        StudentAddress: "",
        StudnetBirthdate: "",
        StudnetPhone: "",
        Gender: "",
        ParentDetails: "",
        Class: "",
        FeeStatus: "",
        Amount: "",
        StudentPicture: ""
    })
    const ref = useRef()
    // update data get function
    const updataDataGet = async () => {
        // const allclassesdata = await axios.get(`http://localhost:5000/users/`)
        const { data } = await axios.get(`/api/Manage/GetStudent/${Id}`)
        const responce = await axios.get(`/api/Manage/GetClass`)
        setAllClasses(responce.data)
        setinputVal({ StudentName: data.StudentName, StudentRollno: data.StudentRollno, StudentAddress: data.StudentAddress, StudnetBirthdate: moment(new Date(data.StudentBirthdate)).format("YYYY-MM-DD"), StudnetPhone: data.StudentPhone, Gender: data.Gender, ParentDetails: data.ParentDetails, FeeStatus: data.Fee, Amount: data.Amount, StudentPicture: data.StudentPicture ? data.StudentPicture : "" })
        // setAllClasses(allclassesdata.data)
    }
    useEffect(() => {
        if (ref.current === true && classID !== undefined) {
            updataDataGet()
        }
        return () => {
            ref.current = true
        }
    }, [Id])

    const handleFile = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setimageSelct(reader.result)
        }
    }

    const handleInput = (e) => {
        const { name, value } = e.target;
        setinputVal((preVal) => {
            return {
                ...preVal,
                [name]: value.toLowerCase()
            }
        })
    }

    const submitData = async (e) => {
        e.preventDefault();
        // /Manage/GetStudent/updateStudent
        const { StudentName, StudentRollno, StudentAddress, StudnetBirthdate, StudnetPhone, Gender, ParentDetails, Class, Amount, StudentPicture } = inputVal;
        if (!StudentName || !StudentRollno || !StudnetBirthdate || !StudentAddress || !Gender || !ParentDetails || !Amount) {
            return window.alert("fill all the neccessary fields first!")
        }

        const responce = await axios.post("/api/Manage/GetStudent/updateStudent",
            { Id, StudentName, StudentRollno, StudentAddress, StudnetBirthdate, StudnetPhone, Gender, ParentDetails, Class, FeeStatus: Amount > 0 ? "Paid" : "NotPaid", Amount, StudentPicture: StudentPicture ? StudentPicture : null, imageSelct: imageSelct ? imageSelct : null },
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                withCredentials: true
            })
        if (responce.status === 200) {
            onHide()
            makeSysUptodateID = Id
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
                        <h2>Update Student <span>(For example 1,2,3-A,etc...)</span></h2>
                        <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                    </div>
                    <div className={style.Form}>
                        <form className={style.AddStudentForm} onSubmit={submitData}>
                            <div className={style.inputLayer}>
                                <label htmlFor='StudentName'>Studnet Name <sup>change or leave</sup></label>
                                <input
                                    type="text"
                                    placeholder="Enter Student name"
                                    onChange={handleInput}
                                    value={inputVal.StudentName}
                                    name="StudentName"
                                    id='StudentName' />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='StudentRollno'>Studnet Roll no <sup>change or leave</sup></label>
                                <input
                                    type="number"
                                    placeholder="2022-50"
                                    onChange={handleInput}
                                    value={inputVal.StudentRollno}
                                    name="StudentRollno"
                                    id='StudentRollno' />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='StudentAddress'>Studnet Address <sup>change or leave</sup></label>
                                <input
                                    type="text"
                                    placeholder="Address here.."
                                    onChange={handleInput}
                                    value={inputVal.StudentAddress}
                                    name="StudentAddress"
                                    id='StudentAddress' />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='StudnetBirthdate'>Student Birthdate<sup>change or leave</sup></label>
                                <input
                                    type="date"
                                    onChange={handleInput}
                                    value={inputVal.StudnetBirthdate}
                                    name="StudnetBirthdate"
                                    id='StudnetBirthdate' />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='StudnetPhone'>Studnet Phone <sup>change or leave</sup></label>
                                <input
                                    type="number"
                                    placeholder="03170816287"
                                    onChange={handleInput}
                                    value={inputVal.StudnetPhone}
                                    name="StudnetPhone"
                                    id='StudnetPhone' />
                            </div>
                            <Form.Group className={style.inputLayer}   >
                                <Form.Label htmlFor='Gender'>Gender <sup>change or leave</sup></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Gender"
                                    onChange={handleInput}
                                    value={inputVal.Gender}
                                    name="Gender"
                                    id='Gender' />
                            </Form.Group>
                            <Form.Group className={style.inputLayer}   >
                                <Form.Label htmlFor='Remarks'>Parent Details <sup>change or leave</sup></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="Remarks"
                                    id="Remarks"
                                    onChange={handleInput}
                                    value={inputVal.ParentDetails}
                                    placeholder="Parent Details here"
                                    style={{ height: '100px', width: "100%" }}
                                />
                            </Form.Group>
                            <Form.Group className={style.inputLayer}  >
                                <Form.Label htmlFor='Class'>Update Class<sup> change or leave</sup></Form.Label>
                                <Form.Select aria-label="Default select example" name="Class" onChange={handleInput} id='Class'>
                                    <option value="">Select Class here...</option>
                                    {AllClasses.map((val, index, arr) => {
                                        return (<option value={val.className} key={index}>{val.className}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className={style.inputLayer}   >
                                <Form.Label htmlFor='StudentFeeAmount'>Amount <sup>change or leave</sup></Form.Label>
                                <Form.Control
                                    type="number"
                                    onChange={handleInput}
                                    value={inputVal.Amount}
                                    name="Amount"
                                    id='StudentFeeAmount' />
                            </Form.Group>
                            {/* </> : ""} */}

                            <Form.Group className={style.inputLayer}   >
                                <Form.Label htmlFor='StudentPicture'>Student Picture <sup>change or leave</sup></Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleFile}
                                    accept="image/png , image/jpg , image/jpeg"
                                    id='StudentPicture' />
                            </Form.Group>

                            <div className={style.inputLayer}>
                                <Button variant="primary" type="submit" >
                                    Submit
                                </Button>
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







const AddResultModel = ({ Id, onHide }) => {
    // console.log(Id);
    
    const ref = useRef()
    ref.current = false
    const [ExamsData, setExamsData] = useState([])
    const [AllSubjects, setAllSubjects] = useState([])
    const [inputVal, setinputVal] = useState(
        {
            ExamTitle:"",
            Subject:"",
            ObtaineMarks:""
        }
    )

    const handleInput = (e) => {
        const { name, value } = e.target;
        setinputVal((preVal) => {
            return {
                ...preVal,
                [name]: value
            }
        })
    }

    const loadUserData=async()=>{
        const LoadExamData = await axios.get(`/api/auth/GetAllExams`);
        setExamsData(LoadExamData.data)
    }

    useEffect(() => {
        if (ref.current === true) {
            loadUserData()
        }
        return () => {
            ref.current = true
        }
    }, [])

    const submitData = async (e) => {
        e.preventDefault();
        const {ExamTitle,Subject,ObtaineMarks}=inputVal;
        console.log(ExamTitle,Subject,ObtaineMarks)
        // /auth/Result

        if (!ExamTitle || !Id ||!Subject ||!ObtaineMarks) {
            return window.alert("Missing Informaion ")
        }
        const response = await axios.post("/api/Manage/AddExamMarks", {
            ExamTitle ,Id,Subject,ObtaineMarks
        }, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            withCredentials: true
        })
        if (response.status === 200) {
            onHide()
            makeSysUptodateID=Id
            return window.alert("Marks Added Successfully!")
        } else {
            return window.alert("Sorry! there is an error.")
        }
    }


    return (
        <div className={style.MyUpdateCenterModel}>
            <div className={style.fullupdateform}>
                <div className={style.updateForm}>
                    <div className={style.Title}>
                        <h2>Add Result Image <span>*</span></h2>
                        <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                    </div>
                    <div className={style.Form}>
                        <form className={style.AddExamForm} onSubmit={submitData}>
                        <Form.Group className="mb-3"  >
                                <Form.Label htmlFor='ExamTitle'>Select Exam Title<sup>*</sup></Form.Label>
                                <Form.Select name="ExamTitle" onChange={handleInput} id='ExamTitle'>
                                    <option value="">Exam Title...</option>
                                    {ExamsData.map((val, index, arr) => {
                                        return (<option value={val.Title} key={index}>{val.Title}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                        <Form.Group className="mb-3"  >
                                <Form.Label htmlFor='Parentselect'>Subject<sup>*</sup></Form.Label>
                                <Form.Select name="Subject" onChange={handleInput} id='Parentselect'
                                   onClick={async (e) => {
                                    const responce = await axios.get(`/api/Manage/ExamsSubject/?ExamTitle=${inputVal.ExamTitle}`);
                                    if (responce.status === 200) {
                                        setAllSubjects(responce.data)
                                    }
                                }}>
                                    <option value="">Select Subject here...</option>
                                    {AllSubjects.map((val, index, arr) => {
                                        return (<option value={`${val.Subject} ,${val.TotalMarks}`} key={index}>{val.Subject} ({val.TotalMarks} Marks)</option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className={style.inputLayer} >
                                <Form.Label htmlFor='ObtainMarks'>Obtained Marks<sup>*</sup></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ObtaineMarks"
                                    onChange={handleInput}
                                    value={inputVal.ObtaineMarks}
                                    id='ObtainMarks' />
                            </Form.Group>

                            <div className={style.inputLayer}>
                                <Button variant="primary" type="submit" style={{marginTop:"10px"}}>
                                    Add Marks
                                </Button>
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






const Student = () => {

    const { status } = useSelector((state) => { return state.controls })
    const [modalShow, setModalShow] = useState(false);
    const [Deleted, setDeleted] = useState(false)
    const [updateModelShow, setupdateModelShow] = useState(false);
    const [Fulldata, setFulldata] = useState([])
    const [data, setdata] = useState([])
    const [Result, setResult] = useState(false);
    const [inputVal, setinputVal] = useState("")
    const [SortValue, setSortValue] = useState("")
    const [sortFilterVal, setsortFilterVal] = useState("")
    const [CurrentPage, setCurrentPage] = useState(0)
    const [dataPerPage] = useState(4)
    const [operation, setoperation] = useState("")
    const ref = useRef()
    ref.current = false

    // working on loading pagination and searching and filtering of data in a table
    useEffect(() => {
        if (ref.current === true) {
            loadUserData(0, 4, 0)
        }
        return () => {
            ref.current = true
            // setModelrender(!Modelrender)
        }
    }, [makeSysUptodateID, Deleted])
    // load user data
    const loadUserData = async (start, end, increase, optType = null, filterOrSort) => {
        // combinig it with search functionality
        switch (optType) {
            case "search":
                setoperation(optType)
                setSortValue("")
                const readDatawithSearchQuery = await axios.get(`/api/Manage/GetStudent?q=${inputVal}&_start=${start}&_end=${end}`);
                setdata(readDatawithSearchQuery.data)
                // setinputVal("")
                setCurrentPage(CurrentPage + increase)
                break;

            case "sort":
                setoperation(optType)
                setSortValue(filterOrSort)
                const sortData = await axios.get(`/api/Manage/GetStudent?_sort=${filterOrSort}&_order=asc&_start=${start}&_end=${end}`);
                setdata(sortData.data)
                setCurrentPage(CurrentPage + increase)
                break;

            default:
                const firstOnlyReadDatafour = await axios.get(`/api/Manage/GetStudent?_start=${start}&_end=${end}`);//_start and _end help to get specific data
                setdata(firstOnlyReadDatafour.data)
                setCurrentPage(CurrentPage + increase)
                break;
        }
        const fullData = await axios.get("/api/Manage/GetStudent"); // for pagination setting out of pages 
        setFulldata(fullData.data)

    }

    // search function
    const handleSearch = async (e) => {
        e.preventDefault();
        loadUserData(0, 4, 0, "search")
    }

    // reset function
    const resetTable = async () => {
        setoperation("")
        setinputVal("")
        setsortFilterVal("")
        setSortValue("")
        loadUserData(0, 4, 0)
    }

    const sortOptions = ["StudentName", "StudentFee", "id"];
    // sorting fnction
    const handleSort = async (e) => {
        let value = e.target.value;
        setSortValue(value)
        loadUserData(0, 4, 0, "sort", value)
    }

    // delete data function
    const deleteData = async (Id, ParentInfo, Image) => {
        const responce = await axios.post("/api/Manage/GetStudent/removeStudent", { Id, ParentInfo, Image }, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            withCredentials: true
        })
        if (responce.status === 200) {
            setDeleted(!Deleted)
            return window.alert("successfully Deleted!");
        } else {
            setDeleted(!Deleted)
            return window.alert("error in Deletion of Row");
        }
    }

    return (
        <>
            <Navbar />
            <div className={style.StudentDashboardWrapper}>
                <Sidebar ToggleStatus={status} />

                <div className={status ? style.StudentPageSmall : style.StudentPageFull}>


                    <div className={style.StudentPageContainer}>
                        <div className={style.StudentPageTopPart}>
                            <Button variant="primary" onClick={() => {
                                setModalShow(true)
                                Modelrender = true
                            }}>
                                Add Student <AddIcon className={style.btnPlusIcon} />
                            </Button>

                            {Modelrender === true ? <MyVerticallyCenteredModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            /> : ""}
                        </div>
                        <div className={style.wrapMidPar}>
                            <div className={style.StudentPageMidPart}>
                                <h1>Registered Students</h1>
                                <div className={style.searchField} onSubmit={handleSearch}>
                                    <Form className={style.searchAlign}>
                                        <Form.Control type="Search" placeholder="By Name (e.g:- Class 1)"
                                            value={inputVal}
                                            onChange={(e) => { setinputVal(e.target.value) }}
                                        />
                                        <div className={style.formButtons}>
                                            <Button variant="primary" type="submit" >
                                                <span>Search</span> <ManageSearchRoundedIcon />
                                            </Button>
                                            <Button variant="primary" onClick={resetTable}>
                                                <span>Reset</span>
                                            </Button>
                                        </div>
                                    </Form>
                                    <div className={style.sortingsys}>
                                        <select name="" id="" onChange={handleSort} value={SortValue}>
                                            <option>Please Select Sort Value</option>
                                            {sortOptions.map((val, index) => (
                                                <option value={val} key={index}>{val}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className={style.table}>

                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>ID#</th>
                                                <th>Student Image</th>
                                                <th>Student Name</th>
                                                <th>Roll no</th>
                                                <th>Birthdate</th>
                                                <th>Gender</th>
                                                <th>Student Phone</th>
                                                <th>Address</th>
                                                <th>Parent Information</th>
                                                <th>Class</th>
                                                <th>Fee</th>
                                                <th>New Result</th>
                                                <th>All Results</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.length === 0 ?
                                                <tr>
                                                    <td colSpan={12}>No Data Found</td>
                                                </tr> :
                                                data.map((val, index, arr) => {
                                                    if (val !== undefined) {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{val.id}</td>
                                                                <td className={style.imageShape}>{val.StudentPicture ? <img src={`/Storage/Students/${val.StudentPicture}`} alt="not found" /> : <img alt="not found" />}</td>
                                                                <td>{val.StudentName}</td>
                                                                <td>{val.StudentRollno}</td>
                                                                <td>{moment(new Date(val.StudentBirthdate)).format("YYYY/MM/DD")}</td>
                                                                <td>{val.Gender}</td>
                                                                <td>{val.StudentPhone}</td>
                                                                <td>{val.StudentAddress}</td>
                                                                <td>{val.ParentName}</td>
                                                                <td className={style.classList}>{val.Classes.length === 0 ? "NAN"
                                                                    :
                                                                    <select>
                                                                        {val.Classes.map((data, index, arr) => {
                                                                            return (
                                                                                <option value={data} key={index}>{data}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                }</td>
                                                                <td>{(val.Fee === "paid") ? `${val.Fee} ${val.Amount}` : val.Fee}</td>
                                                                <td>  <button onClick={() => {
                                                                    classID = val.id
                                                                    setResult(true)
                                                                }}>
                                                                    <AddBoxOutlinedIcon className={style.addResultBtn} /> Add Result
                                                                </button></td>
                                                                <td className={style.classList}>{val.StudentMarks.length === 0 ? "NAN"
                                                                    :
                                                                    <select>
                                                                        {val.StudentMarks.map((data, index, arr) => {
                                                                            return (
                                                                                <option value={`${data.Title} ${data.Class}`} key={index}>{` ${data.Class} ${data.Subject} ${data.ObtainMarks}/${data.TotalMarks}`} </option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                }</td>

                                                                <td>
                                                                    <div className={style.actionsALign}>
                                                                        <DriveFileRenameOutlineOutlinedIcon className={style.edit} onClick={() => {
                                                                            classID = val.id
                                                                            setupdateModelShow(true)
                                                                        }} />
                                                                        <CloseRoundedIcon className={style.delete}
                                                                            onClick={() => { deleteData(val.id, val.ParentName, val.StudentPicture) }} />
                                                                    </div>
                                                                </td>

                                                            </tr>
                                                        )
                                                    }

                                                })}
                                        </tbody>
                                    </Table>
                                </div>

                                <div className={style.paginationBtns}>
                                    {/* creating pagination functionality */}
                                    {(data.length < 4 && CurrentPage === 0) ? null :
                                        CurrentPage === 0 ?
                                            <>
                                                <span>1 of {Math.ceil(Fulldata.length / dataPerPage)}</span>
                                                <button
                                                    onClick={() => loadUserData(4, 8, 1, operation, sortFilterVal)}
                                                ><ArrowForwardIosOutlinedIcon className={style.nxtBtn}
                                                    /></button>
                                            </>
                                            : (CurrentPage < dataPerPage - 1 && data.length === dataPerPage) ?
                                                <>
                                                    <button><ArrowBackIosOutlinedIcon className={style.prevBtn}
                                                        onClick={() => {
                                                            loadUserData((CurrentPage - 1) * 4, CurrentPage * 4, -1, operation, sortFilterVal)
                                                        }}
                                                    /></button>
                                                    <span>{CurrentPage + 1} of {Math.ceil(Fulldata.length / dataPerPage)}</span>
                                                    <button
                                                        onClick={() => loadUserData((CurrentPage + 1) * 4, (CurrentPage + 2) * 4, 1, operation, sortFilterVal)}
                                                    ><ArrowForwardIosOutlinedIcon className={style.nxtBtn}
                                                        /></button>
                                                </>
                                                : <>
                                                    <button
                                                        onClick={() => loadUserData((CurrentPage - 1) * 4, CurrentPage * 4, -1, operation, sortFilterVal)}
                                                    ><ArrowBackIosOutlinedIcon className={style.prevBtn}
                                                        /></button>
                                                    <span>{CurrentPage + 1} of {Math.ceil(Fulldata.length / dataPerPage)}</span>
                                                </>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {updateModelShow === true ?
                    <DataUPdateModel Id={classID} onHide={() => setupdateModelShow(false)} /> : ""}
                {Result === true ? <AddResultModel Id={classID} onHide={() => setResult(false)} /> : ""}
            </div>
        </>
    )
}

export default Student