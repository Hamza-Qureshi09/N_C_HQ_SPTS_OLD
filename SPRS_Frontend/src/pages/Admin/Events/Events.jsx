import React, { useState, useEffect, useRef } from 'react'
import style from './Events.module.scss'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from '../../../components/Shared/Sidebar/Sidebar'
import Navbar from '../../../components/Shared/Navbar/Navbar'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import AddIcon from '@mui/icons-material/Add';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import moment from "moment"
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';



let EventID;
let Modelrender = false;
let makeSysUptodateID;
function MyVerticallyCenteredModal(props) {
    Modelrender = false;
    const [imageSelct, setimageSelct] = useState("")
    const [inputVal, setinputVal] = useState({
        EventTitle: "",
        EventDescription: "",
        StartingDateTime: "",
        EndingDateTime: "",
    })

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
        const { EventTitle, EventDescription, StartingDateTime, EndingDateTime } = inputVal;
        if (!EventTitle || !EventDescription || !StartingDateTime || !EndingDateTime) {
            return window.alert("Please fill all the neccessary fields first!")
        }
        const responce = await axios.post("/api/Manage/AddEvent",
            { EventTitle, EventDescription, StartingDateTime, EndingDateTime, EventImage: imageSelct ? imageSelct : "" },
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }, withCredentials: true
            })
        if (responce.status === 200) {
            props.onHide()
            makeSysUptodateID = EventTitle
            return window.alert("Successfully Added!");
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
                <Modal.Title id="contained-modal-title-vcenter" className={style.AddEventFormTitle}>
                    Add New Event 🚀
                    {/* <span>(For example 1,2,3-A,etc...)</span> */}
                </Modal.Title>
            </Modal.Header>
            <Form className={style.AddEventForm} onSubmit={submitData}>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='EventTitle'>Event Title <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Title here"
                        onChange={handleInput}
                        value={inputVal.EventTitle}
                        name="EventTitle"
                        id='EventTitle' />
                </Form.Group>

                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='EventDescription'>Event Description <sup>*</sup></Form.Label>
                    <FloatingLabel id="Remarks" label="Remarks">
                        <Form.Control
                            as="textarea"
                            onChange={handleInput}
                            value={inputVal.EventDescription}
                            name="EventDescription"
                            id='EventDescription'
                            placeholder="Description here..."
                            style={{ height: '100px', marginBottom: "10px" }}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='StartDate'>Starting Date & Time <sup>*</sup></Form.Label>
                    <Form.Control
                        type="date"
                        onChange={handleInput}
                        value={inputVal.StartingDateTime}
                        name="StartingDateTime"
                        id='StartDate' />
                </Form.Group>

                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='EndDate'>Ending Date & Time <sup>*</sup></Form.Label>
                    <Form.Control
                        type="date"
                        onChange={handleInput}
                        value={inputVal.EndingDateTime}
                        name="EndingDateTime"
                        id='EndDate' />
                </Form.Group>

                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='EventPicture'>Teacher Picture <sup>(optional)</sup></Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFile}
                        accept="image/png , image/jpg , image/jpeg"
                        id='EventPicture' />
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

// id: findSingleEvent._id,
// Title: findSingleEvent.Title ? findSingleEvent.Title : "",
// StartDate: findSingleEvent.StartDate ? findSingleEvent.StartDate : "",
// EndDate: findSingleEvent.EndDate ? findSingleEvent.EndDate : "",
// Description: findSingleEvent.Description ? findSingleEvent.Description : "",
// EventPicture: findSingleEvent.EventPicture ? findSingleEvent.EventPicture : ""

const DataUPdateModel = ({ Id, onHide }) => {
    const [imageSelct, setimageSelct] = useState("")
    const [inputVal, setinputVal] = useState({
        EventTitle: "",
        EventDescription: "",
        StartingDateTime: "",
        EndingDateTime: "",
        EventPicture: "",
    })
    const ref = useRef()
    // update data get function
    const updataDataGet = async () => {
        const { data } = await axios.get(`/api/Manage/GetEvent/${Id}`)
        setinputVal({ EventTitle: data.Title, StartingDateTime: moment(new Date(data.StartDate)).format("YYYY-MM-DD"), EndingDateTime:moment(new Date(data.EndDate)).format("YYYY-MM-DD"), EventDescription: data.Description,EventPicture:data.EventPicture?data.EventPicture:"" })
    }
    useEffect(() => {
        if (ref.current === true && EventID !== undefined) {
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

    const submitData =async (e) => {
        e.preventDefault();
        const { EventTitle, EventDescription, StartingDateTime, EndingDateTime,EventPicture } = inputVal;
        if(!EventTitle|| !EventDescription|| !StartingDateTime|| !EndingDateTime){
            return window.alert("fill all the neccessary fields first!")
        }
        const responce=await axios.post("/api/Manage/GetEvent/updateEvent",
        {Id,EventTitle, EventDescription, StartingDateTime, EndingDateTime, EventPicture:EventPicture?EventPicture:null, imageSelct:imageSelct?imageSelct:null},
        { headers:{
            "Content-Type":"application/json",      
            Accept:"application/json"   
        },
        withCredentials:true})
        if(responce.status===200){
            onHide()
            makeSysUptodateID=EventTitle
            return window.alert("successfully updated!");
        }else{
            return window.alert("error in update kindly try again!");
        }
    }
    return (
        <div className={style.MyUpdateCenterModel}>
            <div className={style.fullupdateform}>
                <div className={style.updateForm}>
                    <div className={style.Title}>
                        <h2>Update Event <span>🚀</span></h2>
                        <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                    </div>
                    <div className={style.Form}>
                        <form className={style.AddEventForm} onSubmit={submitData}>
                            <div className={style.inputLayer}>
                                <label htmlFor='EventTitle'>Event Title <sup>*</sup></label>
                                <input
                                    type="text"
                                    placeholder="Enter Title here"
                                    onChange={handleInput}
                                    value={inputVal.EventTitle}
                                    name="EventTitle"
                                    id='EventTitle' />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='EventDescription'>Event Description <sup>*</sup></label>
                                <Form.Control
                                    as="textarea"
                                    onChange={handleInput}
                                    value={inputVal.EventDescription}
                                    name="EventDescription"
                                    id='EventDescription'
                                    placeholder="Description here..."
                                    style={{ height: '100px', marginBottom: "10px" }}
                                />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='StartDate'>Starting Date & Time <sup>change or leave</sup></label>
                                <input
                                    type="date"
                                    onChange={handleInput}
                                    value={inputVal.StartingDateTime}
                                    name="StartingDateTime"
                                    id='StartDate' />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='EndDate'>Ending Date & Time <sup>change or leave</sup></label>
                                <input
                                    type="date"
                                    onChange={handleInput}
                                    value={inputVal.EndingDateTime}
                                    name="EndingDateTime"
                                    id='EndDate' />
                            </div>

                            <Form.Group className={style.inputLayer}   >
                                <Form.Label htmlFor='EventPicture'>Student Picture <sup>change or leave</sup></Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleFile}
                                    accept="image/png , image/jpg , image/jpeg"
                                    id='EventPicture' />
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
const Events = () => {

    const { status } = useSelector((state) => { return state.controls })
    const [modalShow, setModalShow] = useState(false);
    const [Deleted, setDeleted] = useState(false)
    const [updateModelShow, setupdateModelShow] = useState(false);
    const [Fulldata, setFulldata] = useState([])
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
                const readDatawithSearchQuery = await axios.get(`/api/Manage/GetEvent?q=${inputVal}&_start=${start}&_end=${end}`);
                setdata(readDatawithSearchQuery.data)
                // setinputVal("")
                setCurrentPage(CurrentPage + increase)
                break;

            case "sort":
                setoperation(optType)
                setSortValue(filterOrSort)
                const sortData = await axios.get(`/api/Manage/GetEvent?_sort=${sortFilterVal}&_order=asc&_start=${start}&_end=${end}`);
                setdata(sortData.data)
                setCurrentPage(CurrentPage + increase)
                break;

            default:
                const firstOnlyReadDatafour = await axios.get(`/api/Manage/GetEvent?_start=${start}&_end=${end}`);//_start and _end help to get specific data
                setdata(firstOnlyReadDatafour.data)
                setCurrentPage(CurrentPage + increase)
                break;
        }
        const fullData = await axios.get("/api/Manage/GetEvent"); // for pagination setting out of pages 
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

    const sortOptions = ["Title", "StartDate", "id"];
    // sorting fnction
    const handleSort = async (e) => {
        let value = e.target.value;
        setSortValue(value)
        loadUserData(0, 4, 0, "sort", value)
    }

            // delete data function
            const deleteData=async(Id)=>{
                const responce=await axios.post("/api/Manage/GetEvent/removeEvent",{Id},{
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
            <Navbar />
            <div className={style.EventDashboardWrapper}>
                <Sidebar ToggleStatus={status} />

                <div className={status ? style.EventPageSmall : style.EventPageFull}>


                    <div className={style.EventPageContainer}>
                        <div className={style.EventPageTopPart}>
                            <Button variant="primary" onClick={() => {
                                setModalShow(true)
                                Modelrender = true
                            }}>
                                Add Event <AddIcon className={style.btnPlusIcon} />
                            </Button>

                            {Modelrender === true ? <MyVerticallyCenteredModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            /> : ""}
                        </div>
                        <div className={style.wrapMidPar}>
                            <div className={style.EventPageMidPart}>
                                <h1>Events Record </h1>
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
                                <div className={style.EventCards}>
                                    {/* event cards */}
                                    {data.length === 0 ?
                                        <h4>No Data Found</h4>
                                        :
                                        data.map((val, index, arr) => {
                                            if (val !== undefined) {
                                                return (
                                                    <Card className={style.Card} key={index}>
                                                        <CardMedia
                                                            component="img"
                                                            alt="not found"
                                                            height="140"
                                                            image={`/Storage/Events/${val.EventPicture ? val.EventPicture : ""}`}
                                                        />
                                                        <CardContent className={style.cardContent}>
                                                            <h3>{val.Title} </h3>
                                                            <div className={style.cardTimingDate}>
                                                                <p><b>Starting:- </b> <span>{moment(new Date(val.StartDate)).format("YYYY/MM/DD")}</span> </p>
                                                                <p><b>Closing:- </b> <span>{moment(new Date(val.EndDate)).format("YYYY/MM/DD")}</span> </p>
                                                            </div>
                                                            <p>
                                                                <b>Description: </b> {val.Description}
                                                            </p>
                                                        </CardContent>
                                                        <CardActions>
                                                            <div className={style.actionsALign}>
                                                                <DriveFileRenameOutlineOutlinedIcon className={style.edit} onClick={() => {
                                                                    EventID = val.id
                                                                    setupdateModelShow(true)
                                                                }} />
                                                                <DeleteOutlineOutlinedIcon className={style.delete} onClick={()=>{deleteData(val.id,val.Classes,val.TeacherImage)}} />
                                                            </div>
                                                        </CardActions>
                                                    </Card>
                                                )
                                            }
                                        })
                                    }
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
                    <DataUPdateModel Id={EventID} onHide={() => setupdateModelShow(false)} /> : ""}
            </div>
        </>

    )
}

export default Events