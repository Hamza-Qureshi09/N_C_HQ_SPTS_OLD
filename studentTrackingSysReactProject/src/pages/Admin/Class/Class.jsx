import React, { useState, useEffect, useRef } from 'react'
import style from './Class.module.scss'
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

let classID;
let Modelrender = false;
let makeSysUptodateID;
function MyVerticallyCenteredModal(props) {
    Modelrender = false;
    const [inputVal, setinputVal] = useState({
        className: "",
        Fee: ""
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


    const submitData = async (e) => {
        e.preventDefault();
        const { className, Fee } = inputVal;
        if (!className || !Fee) {
            return window.alert("Please fill all the fields first!")
        }
        const response = await axios.post("/api/Manage/AddClass", {
            className, Fee
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
            makeSysUptodateID=inputVal.className
            return window.alert("Class added successfully!")
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
                <Modal.Title id="contained-modal-title-vcenter" className={style.AddClassFormTitle}>
                    Add Class <span>(For example 1,2,3-A,etc...)</span>
                </Modal.Title>
            </Modal.Header>
            <Form className={style.AddClassForm} onSubmit={submitData}>
                <Form.Group className="mb-3" controlId="formBasicText"  >
                    <Form.Label>Class Name <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter class name"
                        onChange={handleInput}
                        value={inputVal.className}
                        name="className" />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicText" >
                    <Form.Label>Class Fees <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="e.g:- 2000"
                        onChange={handleInput}
                        value={inputVal.Fee}
                        name="Fee" />
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
    // console.log(Id)
    const [className, setclassName] = useState("")
    const [Fee, setFee] = useState(0)
    const ref = useRef()
    // update data get function
    const updataDataGet = async () => {
        const { data } = await axios.get(`/api/Manage/GetClass/${Id}`)
        setclassName(data.className)
        setFee(data.Fee)
    }
    useEffect(() => {
        if (ref.current === true && classID !== undefined) {
            updataDataGet()
        }
        return () => {
            ref.current = true
        }
    }, [Id])


    const submitData = async(e) => {
        e.preventDefault();
        if(!className || !Fee){
            return window.alert("fill all the fields first!")
        }
        const responce=await axios.post("/api/Manage/GetClass/updateClass",
        {className,Fee,Id},
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
                    <h2>Update Class <span>(For example 1,2,3-A,etc...)</span></h2>
                    <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                </div>
                <div className={style.Form}>
                    <form className={style.AddClassForm} onSubmit={submitData}>
                        <div className={style.inputLayer}>
                            <label htmlFor="ClassName">Update Class Name <sup>*</sup></label>
                            <input type="text"
                                id='ClassName'
                                placeholder="Enter class name"
                                onChange={(e) => { setclassName(e.target.value) }}
                                value={className} />
                        </div>
                        <div className={style.inputLayer}>
                            <label htmlFor="Fee">update Class Fees <sup>*</sup></label>
                            <input type="number"
                                id='Fee'
                                placeholder="e.g:- 2000"
                                onChange={(e) => { setFee(e.target.value) }}
                                value={Fee} />
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

const Class = () => {
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
                const readDatawithSearchQuery = await axios.get(`/api/Manage/GetClass?q=${inputVal}&_start=${start}&_end=${end}`);
                setdata(readDatawithSearchQuery.data)
                // setinputVal("")
                setCurrentPage(CurrentPage + increase)
                break;

            case "sort":
                setoperation(optType)
                setSortValue(filterOrSort)
                const sortData = await axios.get(`/api/Manage/GetClass?_sort=${filterOrSort}&_start=${start}&_end=${end}`);
                setdata(sortData.data)
                setCurrentPage(CurrentPage + increase)
                break;

            default:
                const firstOnlyReadDatafour = await axios.get(`/api/Manage/GetClass?_start=${start}&_end=${end}`);//_start and _end help to get specific data
                setdata(firstOnlyReadDatafour.data)
                setCurrentPage(CurrentPage + increase)
                break;
        }
        const fullData = await axios.get("/api/Manage/GetClass");
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

    const sortOptions = ["Cname", "Cfee", "_id"];
    // sorting fnction
    const handleSort = async (e) => {
        let value = e.target.value;
        // console.log(value)
        setSortValue(value)
        loadUserData(0, 4, 0, "sort", value)
    }

    // delete data function
    const deleteData=async(Id)=>{
        const responce=await axios.post("/api/Manage/GetClass/removeClass",{Id},{
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
            <div className={style.ClassDashboardWrapper}>
                <Sidebar ToggleStatus={status} />

                <div className={status ? style.ClassPageSmall : style.ClassPageFull}>


                    <div className={style.ClassPageContainer}>
                        <div className={style.ClassPageTopPart}>
                            <Button variant="primary" onClick={() => {
                                setModalShow(true)
                                Modelrender = true
                            }}>
                                Add Class <AddIcon className={style.btnPlusIcon} />
                            </Button>

                            {Modelrender === true ? <MyVerticallyCenteredModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            /> : ""}
                        </div>
                        <div className={style.wrapMidPar}>
                            <div className={style.ClassPageMidPart}>
                                <h1>List of Classes</h1>
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
                                                <th>Class Name</th>
                                                <th>Fee</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.length === 0 ?
                                                <tr>
                                                    <td colSpan={4}>No Data Found</td>
                                                </tr> :
                                                data.map((val, index, arr) => {
                                                    if (val !== undefined) {
                                                        return (
                                                            <tr key={index}>
                                                                <td style={{color:"#0077ff"}}>{val.id}</td>
                                                                <td>{val.className}</td>
                                                                <td>{val.Fee}</td>

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

export default Class