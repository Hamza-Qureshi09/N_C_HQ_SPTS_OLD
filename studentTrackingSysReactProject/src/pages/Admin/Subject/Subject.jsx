import React, { useState, useEffect, useRef } from 'react'
import style from './Subject.module.scss'
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
import moment from "moment"


let classID;
let Modelrender = false;
let makeSysUptodateID;
function MyVerticallyCenteredModal(props) {
    const [AllClasses, setAllClasses] = useState([])
    Modelrender = false;
    const [inputVal, setinputVal] = useState({
        subjectName: "",
        Class: "",
        Time: ""
    })

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
        setinputVal((preVal) => {
            return {
                ...preVal,
                [name]: value.toLowerCase()
            }
        })
    }


    const submitData = async(e) => {
        e.preventDefault(); 
        const {subjectName,Class,Time}=inputVal
        if (!subjectName || !Class || !Time) {
            return window.alert("Please fill all the fields first!")
        }

        const response = await axios.post("/api/Manage/AddSubject", {
            subjectName,Class,Time
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
            makeSysUptodateID=subjectName
            return window.alert("Subject added successfully!")
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
                <Modal.Title id="contained-modal-title-vcenter" className={style.AddSubjectFormTitle}>
                    Add Subject <span>(For example English,Math,etc...)</span>
                </Modal.Title>
            </Modal.Header>
            <Form className={style.AddSubjectForm} onSubmit={submitData}>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='subjectName'>Subject Name <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Subject name"
                        onChange={handleInput}
                        value={inputVal.subjectName}
                        name="subjectName"
                        id='subjectName' />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
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
                    <Form.Label htmlFor='Time'>Time<sup>*</sup></Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="08-12-2022"
                        onChange={handleInput}
                        value={inputVal.Time}
                        name="Time"
                        id='Time' />
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
    // console.log(Id);
    const [GetAllClasses, setGetAllClasses] = useState([])
    const [inputVal, setinputVal] = useState({
        subjectName: "",
        Class: "",
        Time: ""
    })
    const ref = useRef()
    // update data get function
    const updataDataGet = async () => {
        const responce = await axios.get(`/api/Manage/GetClass`)
        const { data } = await axios.get(`/api/Manage/GetSubject/${Id}`)
        setinputVal({subjectName:data.Subjectname,Class:data.SubjectClass,Time:moment(new Date(data.DateTime)).format("YYYY-MM-DDThh:mm")})
        setGetAllClasses(responce.data)
    }
    useEffect(() => {
        if (ref.current === true && classID !== undefined) {
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
        const {subjectName,Class,Time}=inputVal
        if(!subjectName || !Class ||!Time){
            return window.alert("fill all the fields first!")
        }
        const responce=await axios.post("/api/Manage/GetSubject/updateSubject",
        {subjectName,Class,Id,Time},
        { headers:{
            "Content-Type":"application/json",      
            Accept:"application/json"   
        },
        withCredentials:true})
        if(responce.status===200){
            onHide()
            makeSysUptodateID=Id
            return window.alert("successfully updated!");
        }else{
            return window.alert("error in update kindly try again!");
        }
    }
    return (
        <div className={style.MyUpdateCenterModel}>
            <div className={style.updateForm}>
                <div className={style.Title}>
                    <h2>Update Subject <span>(For example 1,2,3-A,etc...)</span></h2>
                    <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                </div>
                <div className={style.Form}>
                    <form className={style.AddSubjectForm} onSubmit={submitData}>
                        <div className={style.inputLayer}>
                            <label htmlFor="subjectName">Update Subject Name <sup>*</sup></label>
                            <input
                                type="text"
                                placeholder="Enter Subject name"
                                onChange={handleInput}
                                value={inputVal.subjectName}
                                name="subjectName"
                                id='subjectName' />
                        </div>
                        <div className={style.inputLayer}>
                            <label htmlFor="Class">Select Class <sup>change or leave</sup></label>
                            <select name="Class" onChange={handleInput} id='Class'>
                                <option>Select Class here...</option>
                                {GetAllClasses.map((val, index, arr) => {
                                    return (<option value={val.className} key={index}>{val.className}</option>)
                                })}
                            </select>
                        </div>
                        <div className={style.inputLayer}>
                            <label htmlFor="Time">New Time <sup>change or Leave</sup></label>
                            <input
                                 type="date"
                                 placeholder="08-12-2022"
                                 onChange={handleInput}
                                 value={inputVal.Time}
                                 name="Time" 
                                 id='Time' />
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
    )
}



const Subject = () => {
    const { status } = useSelector((state) => { return state.controls })
    const [modalShow, setModalShow] = useState(false);
    const [updateModelShow, setupdateModelShow] = useState(false);
    const [Fulldata, setFulldata] = useState([])
    const [Deleted, setDeleted] = useState(false)
    const [data, setdata] = useState([])
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
                const readDatawithSearchQuery = await axios.get(`/api/Manage/GetSubjects?q=${inputVal}&_start=${start}&_end=${end}`);
                setdata(readDatawithSearchQuery.data)
                // setinputVal("")
                setCurrentPage(CurrentPage + increase)
                break;

            case "sort":
                setoperation(optType)
                setSortValue(filterOrSort)
                const sortData = await axios.get(`/api/Manage/GetSubjects?_sort=${sortFilterVal}&_start=${start}&_end=${end}`);
                setdata(sortData.data)
                setCurrentPage(CurrentPage + increase)
                break;

            default:
                const firstOnlyReadDatafour = await axios.get(`/api/Manage/GetSubjects?_start=${start}&_end=${end}`);//_start and _end help to get specific data
                setdata(firstOnlyReadDatafour.data)
                setCurrentPage(CurrentPage + increase)
                break;
        }
        const fullData = await axios.get("/api/Manage/GetSubjects"); // for pagination setting out of pages 
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

    const sortOptions = ["Subjectname", "SubjectClass", "id"];
    // sorting fnction
    const handleSort = async (e) => {
        let value = e.target.value;
        setSortValue(value)
        loadUserData(0, 4, 0, "sort", value)
    }


        // delete data function
        const deleteData=async(Id)=>{
            const responce=await axios.post("/api/Manage/GetSubject/removeSubject",{Id},{
                headers:{
                    "Content-Type":"application/json",      
                    Accept:"application/json"   
                },
                withCredentials:true
            })
            if(responce.status===200){
                setDeleted(!Deleted)
                return window.alert("successfully Deleted!"); 
            }else{
                setDeleted(!Deleted)
                return window.alert("error in Deletion of Row");
            }
        }
    return (
        <>
        <Navbar/>
        <div className={style.SubjectDashboardWrapper}>
            <Sidebar ToggleStatus={status} />

            <div className={status ? style.SubjectPageSmall : style.SubjectPageFull}>


                <div className={style.SubjectPageContainer}>
                    <div className={style.SubjectPageTopPart}>
                        <Button variant="primary" onClick={() => {
                            setModalShow(true)
                            Modelrender = true
                        }}>
                            Add Subject <AddIcon className={style.btnPlusIcon} />
                        </Button>

                        {Modelrender === true ? <MyVerticallyCenteredModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                        /> : ""}
                    </div>
                    <div className={style.wrapMidPar}>
                        <div className={style.SubjectPageMidPart}>
                            <h1>List of Subjects</h1>
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
                                            <th>Subject Name</th>
                                            <th>Class</th>
                                            <th>Time</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length === 0 ?
                                            <tr>
                                                <td colSpan={5}>No Data Found</td>
                                            </tr> :
                                            data.map((val, index, arr) => {
                                                if (val !== undefined) {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{val.id}</td>
                                                            <td>{val.Subjectname}</td>
                                                            <td>{val.SubjectClass}</td>
                                                            <td>{ moment(new Date(val.DateTime)).format("YYYY/MM/DD - hh:mm:ss")}</td>
                                                         
                                                            <td>
                                                            <div className={style.actionsALign}>
                                                                <DriveFileRenameOutlineOutlinedIcon className={style.edit} onClick={() => {
                                                                    classID = val.id
                                                                    setupdateModelShow(true)
                                                                }} />
                                                                <CloseRoundedIcon className={style.delete} onClick={()=>{deleteData(val.id)}} />
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
        </div>
        </>
    )
}

export default Subject