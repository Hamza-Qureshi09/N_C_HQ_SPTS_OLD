import React, { useState, useEffect, useRef } from 'react'
import style from './Exams.module.scss'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from '../../components/Shared/Sidebar/Sidebar'
import Navbar from '../../components/Shared/Navbar/Navbar'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import AddIcon from '@mui/icons-material/Add';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import moment from 'moment'

let ExamID;
let Modelrender = false;
let makeSysUptodateID;
function MyVerticallyCenteredModal(props) {
    Modelrender = false;
    const [AllClasses, setAllClasses] = useState([])
    const [AllSubjects, setAllSubjects] = useState([])
    const [inputVal, setinputVal] = useState({
        Class: "",
        Subject: "",
        ExamsTitle: "",
        ExamsDate: "",
        ExamsDescription: "",
        ExamsOverallMarks: ""
    })

    const fetchAllClasses = async () => {
        const { data } = await axios.get('/api/Manage/GetClass');
        // const reponce = await axios.get('/api/Manage/GetSubjects');
        // console.log(data);
        setAllClasses(data)
        // setAllSubjects(reponce.data)
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
                [name]: value
            }
        })
    }
    // console.log(inputVal.Class,inputVal.Subject)

    const submitData = async (e) => {
        e.preventDefault();
        const { Class, ExamsTitle, ExamsDate, ExamsDescription, ExamsOverallMarks, Subject } = inputVal;
        if (!Class || !ExamsTitle || !ExamsDate || !ExamsDescription || !ExamsOverallMarks || !Subject) {
            return window.alert("Please Fill all the fields for Authentication")
        }
        const response = await axios.post("/api/auth/AddExams", {
            Class, ExamsTitle, ExamsDate, ExamsDescription, ExamsOverallMarks, Subject
        }, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            withCredentials: true
        })
        if (response.status === 200) {
            setinputVal({ Class: "", ExamsTitle: "", ExamsDate: "", ExamsDescription: "", ExamsOverallMarks: "", Subject: "" })
            props.onHide()
            makeSysUptodateID = Subject
            return window.alert("Exam Added Successfully!")
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
                <Modal.Title id="contained-modal-title-vcenter" className={style.AddExamFormTitle}>
                    Add New Exam <span>*</span>
                </Modal.Title>
            </Modal.Header>
            <Form className={style.AddExamForm} onSubmit={submitData}>
                <Form.Group className="mb-3" controlId="formBasicText"  >
                    <Form.Label>Title <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Exam Title"
                        onChange={handleInput}
                        value={inputVal.ExamsTitle.toLowerCase()}
                        name="ExamsTitle" />
                </Form.Group>

                <Form.Label htmlFor='ExamsDescription'>Description <sup>(optional)</sup></Form.Label>
                <FloatingLabel id="ExamsDescription" label="Message here...">
                    <Form.Control
                        as="textarea"
                        name="ExamsDescription"
                        id="ExamsDescription"
                        onChange={handleInput}
                        value={inputVal.ExamsDescription}
                        placeholder="Leave a comment here"
                        style={{ height: '100px', marginBottom: "10px" }}
                    />
                </FloatingLabel>

                <Form.Group className="mb-3"  >
                    <Form.Label htmlFor='date'>Date & Time <sup>*</sup></Form.Label>
                    <Form.Control
                        type="datetime-local"
                        onChange={handleInput}
                        value={inputVal.ExamsDate}
                        name="ExamsDate"
                        id="date" />
                </Form.Group>


                <Form.Group className="mb-3"  >
                    <Form.Label htmlFor='Class'>Class<sup>*</sup></Form.Label>
                    <Form.Select aria-label="Default select example" name="Class" onChange={handleInput} id='Class'>
                        <option>Select Class here...</option>
                        {AllClasses.map((val, index, arr) => {
                            return (<option value={val.className} key={index}>{val.className}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>


                <Form.Group className="mb-3"  >
                    <Form.Label htmlFor='AllSubjects'>Subject<sup>*</sup></Form.Label>
                    <Form.Select aria-label="Default select example" name="Subject" onChange={handleInput} id='AllSubjects'
                        onClick={async (e) => {
                            const responce = await axios.get(`/api/auth/GetAllSubjects/${inputVal.Class}`);
                            if (responce.status === 200) {
                                setAllSubjects(responce.data)
                            }
                        }}
                    >
                        <option>Select Subject here...</option>
                        {AllSubjects.map((val, index, arr) => {
                            return (<option value={val.Subjectname} key={index}>{val.Subjectname}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicText"  >
                    <Form.Label>Marks <sup>*</sup></Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="For Example (50,100, etc...)"
                        onChange={handleInput}
                        value={inputVal.ExamsOverallMarks}
                        name="ExamsOverallMarks" />
                </Form.Group>


                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}



const DataUPdateModel = ({ Id, onHide }) => {
    // console.log(Id);
    const [inputVal, setinputVal] = useState({
        Class: "",
        Subject: "",
        Title: "",
        Date: "",
        Description: "",
        TotalMarks: ""
    })
    const ref = useRef()
    // update data get function
    const updataDataGet = async () => {
        const { data } = await axios.get(`/api/Manage/GetSingleExam/${Id}`)
        setinputVal({ Class: data.Class, Title: data.Title, Date: data.Date, Description: data.Description,TotalMarks:data.TotalMarks ,Subject:data.Subject})
    }
    useEffect(() => {
        if (ref.current === true && ExamID !== undefined) {
            updataDataGet()
        }
        return () => {
            ref.current = true
        }
    }, [Id])


    const handleInput = (e) => {
        const { name, value } = e.target;
        setinputVal((preVal) => {
            return {
                ...preVal,
                [name]: value.toLowerCase()
            }
        })
    }


    const submitData =async (e) => {
        e.preventDefault();
        const { Class, Title, Date, Description, TotalMarks, Subject } = inputVal;
        const response = await axios.post("/api/Manage/UpdateSingleExam", {
            Class, Title, Date, Description, TotalMarks, Subject,Id
        }, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            withCredentials: true
        })
        if (response.status === 200) {
            onHide()
            makeSysUptodateID = Subject
            return window.alert("Updated Successfully!")
        } else {
            return window.alert("Sorry! there is an error.")
        }
    }
    return (
        <div className={style.MyUpdateCenterModel}>
            <div className={style.fullupdateform}>
                <div className={style.updateForm}>
                    <div className={style.Title}>
                        <h2>Update Exam <span>*</span></h2>
                        <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                    </div>
                    <div className={style.Form}>
                        <form className={style.AddExamForm} onSubmit={submitData}>
                            <div className={style.inputLayer}>
                                <label htmlFor="Title">Update Title <sup>*</sup></label>
                                <input type="text"
                                    id='Title'
                                    placeholder="Enter Title"
                                    name="Title"
                                    onChange={handleInput}
                                    value={inputVal.Title} />
                            </div>

                            <div className={style.inputLayer}>
                                <Form.Label htmlFor='Description'>Description <sup>*</sup></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="Description"
                                    id="Description"
                                    onChange={handleInput}
                                    value={inputVal.Description}
                                    placeholder="Leave a little description here"
                                    style={{ height: '100px', marginBottom: "10px" }}
                                />
                            </div>

                            <div className={style.inputLayer}>
                                <label htmlFor="date">update Date <sup> change or leave</sup></label>
                                <input type="datetime-local"
                                    id='date'
                                    onChange={handleInput}
                                    name="ExamsDate"
                                    value={moment(new Date(inputVal.Date)).format("yyyy-MM-DDThh:mm:ss")} />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor="Class">Class <sup>*</sup></label>
                                <input type="text"
                                    id='Class'
                                    readOnly
                                    name="Class"
                                    onChange={handleInput}
                                    value={inputVal.Class} />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor="Subject">Subject <sup>*</sup></label>
                                <input type="text"
                                    id='Subject'
                                    readOnly
                                    name="Subject"
                                    onChange={handleInput}
                                    value={inputVal.Subject} />
                            </div>

                            <div className={style.inputLayer}>
                                <Form.Label htmlFor='TotalMarks'>Total Marks <sup>*</sup></Form.Label>
                                <Form.Control
                                    type="number"
                                    name="TotalMarks"
                                    id="TotalMarks"
                                    onChange={handleInput}
                                    value={inputVal.TotalMarks}
                                />
                            </div>

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


//add Result 
const AddResultModel = ({ Id, onHide }) => {
    // console.log(Id);
    const [imageSelct, setimageSelct] = useState("")

    const handleFile = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setimageSelct(reader.result)
        }
    }


    const submitData = async (e) => {
        e.preventDefault();
        // /auth/Result

        if (!imageSelct || !Id) {
            return window.alert("Missing Informaion ")
        }
        const response = await axios.post("/api/auth/Result", {
            imageSelct, Id
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
            return window.alert("Exam Added Successfully!")
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

                            <Form.Group className={style.inputLayer} >
                                <Form.Label htmlFor='ResultPicture'>Result Image <sup>*</sup></Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleFile}
                                    accept="image/png , image/jpg , image/jpeg"
                                    id='ResultPicture' />
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

const Exams = () => {
    const { status } = useSelector((state) => { return state.controls })
    const [modalShow, setModalShow] = useState(false);
    const [updateModelShow, setupdateModelShow] = useState(false);
    const [Result, setResult] = useState(false);
    const [Fulldata, setFulldata] = useState([])
    const [data, setdata] = useState([])
    const [Deleted, setDeleted] = useState(false)
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
    }, [makeSysUptodateID,Deleted])
    // load user data
    const loadUserData = async (start, end, increase, optType = null, filterOrSort) => {
        // combinig it with search functionality
        switch (optType) {
            case "search":
                setoperation(optType)
                setSortValue("")
                const readDatawithSearchQuery = await axios.get(`/api/auth/GetAllExams?q=${inputVal}&_start=${start}&_end=${end}`);
                setdata(readDatawithSearchQuery.data)
                // setinputVal("")
                setCurrentPage(CurrentPage + increase)
                break;

            case "sort":
                setoperation(optType)
                setSortValue(filterOrSort)
                const sortData = await axios.get(`/api/auth/GetAllExams?_sort=${filterOrSort}&_start=${start}&_end=${end}`);
                setdata(sortData.data)
                setCurrentPage(CurrentPage + increase)
                break;

            default:
                const firstOnlyReadDatafour = await axios.get(`/api/auth/GetAllExams?_start=${start}&_end=${end}`);//_start and _end help to get specific data
                setdata(firstOnlyReadDatafour.data)
                setCurrentPage(CurrentPage + increase)
                break;
        }
        const fullData = await axios.get("/api/auth/GetAllExams");
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

    const sortOptions = ["id", "Title"];
    // sorting fnction
    const handleSort = async (e) => {
        let value = e.target.value;
        setSortValue(value)
        loadUserData(0, 4, 0, "sort", value)
    }

        // delete data function
        const deleteData = async (Id,Image,Class) => {
            const responce = await axios.post("/api/Manage/removeSingleExam", { Id,Image,Class }, {
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
            <div className={style.ExamDashboardWrapper}>
                <Sidebar ToggleStatus={status} />

                <div className={status ? style.ExamPageSmall : style.ExamPageFull}>


                    <div className={style.ExamPageContainer}>
                        <div className={style.ExamPageTopPart}>
                            <Button variant="primary" onClick={() => {
                                setModalShow(true)
                                Modelrender = true
                            }}>
                                Add Exam <AddIcon className={style.btnPlusIcon} />
                            </Button>

                            {Modelrender === true ? <MyVerticallyCenteredModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            /> : ""}
                        </div>
                        <div className={style.wrapMidPar}>
                            <div className={style.ExamPageMidPart}>
                                <h1>Manage Exams</h1>
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
                                                <th>Exam Title</th>
                                                <th>Date & Time</th>
                                                <th>Exam Marks</th>
                                                <th>Class</th>
                                                <th>Subject</th>
                                                <th>Result</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.length === 0 ?
                                                <tr>
                                                    <td colSpan={8}>No Data Found</td>
                                                </tr> :
                                                data.map((val, index, arr) => {
                                                    if (val !== undefined) {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{val.id}</td>
                                                                <td>{val.Title}</td>
                                                                <td> {moment(new Date(val.Date)).format("YYYY/MM/DD - HH:mm:SS")}</td>
                                                                <td>{val.TotalMarks}</td>
                                                                <td>{val.Class}</td>
                                                                <td>{val.Subject}</td>
                                                                <td>{val.FullClassResultPic ?
                                                                <img src={`/Storage/Exams/${val.FullClassResultPic}`} alt="not found"  className={style.imageShape} />
                                                                :
                                                                    <>
                                                                        <button onClick={() => {
                                                                            ExamID = val.id
                                                                            setResult(true)
                                                                        }}>
                                                                            <AddBoxOutlinedIcon className={style.addResultBtn} /> Result
                                                                        </button>
                                                                    </>} </td>

                                                                <td>
                                                                    <div className={style.actionsALign}>
                                                                        <DriveFileRenameOutlineOutlinedIcon className={style.edit} onClick={() => {
                                                                            ExamID = val.id
                                                                            setupdateModelShow(true)
                                                                        }} />
                                                                        <CloseRoundedIcon className={style.delete} onClick={() => { deleteData(val.id,val.FullClassResultPic,val.Class) }}  />
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
                    <DataUPdateModel Id={ExamID} onHide={() => setupdateModelShow(false)} /> : ""}
                {Result === true ? <AddResultModel Id={ExamID} onHide={() => setResult(false)} /> : ""}
            </div>
        </>


    )
}

export default Exams