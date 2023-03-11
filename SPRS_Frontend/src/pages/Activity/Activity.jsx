import React, { useState, useEffect, useRef } from 'react'
import style from './Activity.module.scss'
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
import moment from 'moment'

let ActivityID;
let makeSysUptodateID;
let Modelrender = false;
function MyVerticallyCenteredModal(props) {
    Modelrender = false;
    const [AllClasses, setAllClasses] = useState([])
    const [inputVal, setinputVal] = useState({
        Class: "",
        ActivityTitle: "",
        ActivityDate: "",
        ActivityDescription: ""
    })

    const fetchAllClasses = async () => {
        const { data } = await axios.get('/api/Manage/GetClass');
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
                [name]: value
            }
        })
    }


    const submitData = async (e) => {
        e.preventDefault();
        const { Class, ActivityTitle, ActivityDate, ActivityDescription } = inputVal;

        if (!ActivityTitle || !ActivityDate || !ActivityDescription || !Class) {
            return window.alert("Please fill all the fields first!")
        }

        const response = await axios.post("/api/Manage/AddActivity", {
            Class, ActivityTitle, ActivityDate, ActivityDescription
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
            makeSysUptodateID = ActivityDate
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
                <Modal.Title id="contained-modal-title-vcenter" className={style.AddActivityFormTitle}>
                    Add Activity <span>(For example Play Football, etc...)</span>
                </Modal.Title>
            </Modal.Header>
            <Form className={style.AddActivityForm} onSubmit={submitData}>
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

                <Form.Group className="mb-3" controlId="formBasicText"  >
                    <Form.Label>Title <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Activity Title"
                        onChange={handleInput}
                        value={inputVal.ActivityTitle}
                        name="ActivityTitle" />
                </Form.Group>

                <Form.Group className="mb-3"  >
                    <Form.Label htmlFor='date'>Date <sup>*</sup></Form.Label>
                    <Form.Control
                        type="datetime-local"
                        onChange={handleInput}
                        value={inputVal.ActivityDate}
                        name="ActivityDate"
                        id="date" />
                </Form.Group>
                <Form.Label htmlFor='Remarks'>Description <sup>(optional)</sup></Form.Label>
                <FloatingLabel id="ActivityDescription" label="Message here...">
                    <Form.Control
                        as="textarea"
                        name="ActivityDescription"
                        id="ActivityDescription"
                        onChange={handleInput}
                        value={inputVal.ActivityDescription}
                        placeholder="Leave a comment here"
                        style={{ height: '100px', marginBottom: "10px" }}
                    />
                </FloatingLabel>
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
        Title: "",
        Date: "",
        Description: ""
    })
    const ref = useRef()
    // update data get function
    const updataDataGet = async () => {
        const { data } = await axios.get(`/api/Manage/GetSingleActivity/${Id}`)
        setinputVal({ Class: data.Class, Title: data.Title, Date: moment(new Date(data.Date)).format("yyyy-MM-DDThh:mm:ss"), Description: data.Description })
    }
    useEffect(() => {
        if (ref.current === true && ActivityID !== undefined) {
            updataDataGet()
        }
        return () => {
            ref.current = true
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


    const submitData = async (e) => {
        e.preventDefault();
        const { Class, Title, Date, Description } = inputVal;
        if (!Class || !Title || !Date || !Description) {
            return window.alert("fill all the neccessary fields first!")
        }
        const responce = await axios.post("/api/Manage/UpdateSingleActivity",
            { Id, Class, Title, Date, Description },
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
                        <h2>Update Activity <span>*</span></h2>
                        <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                    </div>
                    <div className={style.Form}>
                        <form className={style.AddActivityForm} onSubmit={submitData}>
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
                                <label htmlFor="Class">Class <sup>change or leave</sup></label>
                                <input type="text"
                                    id='Class'
                                    onChange={handleInput}
                                    name="Class"
                                    value={inputVal.Class} />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor="date">update Date <sup>change or leave</sup></label>
                                <input type="datetime-local"
                                    id='date'
                                    onChange={handleInput}
                                    name="Date"
                                    value={inputVal.Date} />
                            </div>
                            <div className={style.inputLayer}>
                                <Form.Label htmlFor='Remarks'>Description <sup>*</sup></Form.Label>
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

const Activity = () => {
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
    }, [makeSysUptodateID, Deleted])
    // load user data
    const loadUserData = async (start, end, increase, optType = null, filterOrSort) => {
        // combinig it with search functionality
        switch (optType) {
            case "search":
                setoperation(optType)
                setSortValue("")
                const readDatawithSearchQuery = await axios.get(`/api/Manage/GetActivities?q=${inputVal}&_start=${start}&_end=${end}`);
                setdata(readDatawithSearchQuery.data)
                // setinputVal("")
                setCurrentPage(CurrentPage + increase)
                break;

            case "sort":
                setoperation(optType)
                setSortValue(filterOrSort)
                const sortData = await axios.get(`/api/Manage/GetActivities?_sort=${filterOrSort}&_start=${start}&_end=${end}`);
                setdata(sortData.data)
                setCurrentPage(CurrentPage + increase)
                break;

            default:
                const firstOnlyReadDatafour = await axios.get(`/api/Manage/GetActivities?_start=${start}&_end=${end}`);//_start and _end help to get specific data
                setdata(firstOnlyReadDatafour.data)
                setCurrentPage(CurrentPage + increase)
                break;
        }
        const fullData = await axios.get("/api/Manage/GetActivities");
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

    const sortOptions = ["Title", "Class", "id"];
    // sorting fnction
    const handleSort = async (e) => {
        let value = e.target.value;
        setSortValue(value)
        loadUserData(0, 4, 0, "sort", value)
    }

    // delete data function
    const deleteData = async (Id) => {
        const responce = await axios.post("/api/Manage/RemoveSingleActivty", { Id }, {
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
            <div className={style.ActivityDashboardWrapper}>
                <Sidebar ToggleStatus={status} />

                <div className={status ? style.ActivityPageSmall : style.ActivityPageFull}>


                    <div className={style.ActivityPageContainer}>
                        <div className={style.ActivityPageTopPart}>
                            <Button variant="primary" onClick={() => {
                                setModalShow(true)
                                Modelrender = true
                            }}>
                                Add Activity <AddIcon className={style.btnPlusIcon} />
                            </Button>

                            {Modelrender === true ? <MyVerticallyCenteredModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            /> : ""}
                        </div>
                        <div className={style.wrapMidPar}>
                            <div className={style.ActivityPageMidPart}>
                                <h1>List of Activities</h1>
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
                                                <th>Class</th>
                                                <th>Title</th>
                                                <th>Description</th>
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
                                                                <td>{val.Class}</td>
                                                                <td>{val.Title}</td>
                                                                <td>{val.Description}</td>

                                                                <td>
                                                                    <div className={style.actionsALign}>
                                                                        <DriveFileRenameOutlineOutlinedIcon className={style.edit} onClick={() => {
                                                                            ActivityID = val.id
                                                                            setupdateModelShow(true)
                                                                        }} />
                                                                        <CloseRoundedIcon className={style.delete}
                                                                            onClick={() => { deleteData(val.id) }} />
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
                    <DataUPdateModel Id={ActivityID} onHide={() => setupdateModelShow(false)} /> : ""}
            </div>
        </>


    )
}

export default Activity