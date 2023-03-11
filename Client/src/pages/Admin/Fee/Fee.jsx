import React, { useState, useEffect, useRef } from 'react'
import style from './Fee.module.scss'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from '../../../components/Shared/Sidebar/Sidebar'
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
function MyVerticallyCenteredModal(props) {
    Modelrender = false;
    const [AllClasses, setAllClasses] = useState([])
    const [inputVal, setinputVal] = useState({
        Class: "",
        FeesTitle: "",
        Feesyear: "",
        FeesAmount: "",
    })

    
    const fetchAllClasses = async () => {
        const { data } = await axios.get('http://localhost:5000/users');
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


    const submitData = (e) => {
        e.preventDefault();
        const {Class,FeesTitle,Feesyear,FeesAmount}=inputVal;
        console.log(Class,FeesTitle,Feesyear,FeesAmount);
    }
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" className={style.AddFeeFormTitle}>
                    Add Fees <span>(For example Education Fee, Seminar Fee,etc...)</span>
                </Modal.Title>
            </Modal.Header>
            <Form className={style.AddFeeForm} onSubmit={submitData}>
            <Form.Group className="mb-3"  >
                    <Form.Label htmlFor='Class'>Class<sup>*</sup></Form.Label>
                    <Form.Select aria-label="Default select example" name="Class" onChange={handleInput} id='Class'>
                        <option>Select Class here...</option>
                        {AllClasses.map((val, index, arr) => {
                            return (<option value={val.name} key={index}>{val.name}</option>
                            )
                        })}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicText" >
                    <Form.Label>Fees Title<sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ex. Education Fee (2022)"
                        onChange={handleInput}
                        value={inputVal.FeesTitle}
                        name="FeesTitle" />
                </Form.Group>
                <Form.Group className="mb-3"  >
                    <Form.Label htmlFor='FeesYear'>Fees Year <sup>*</sup></Form.Label>
                    <Form.Control
                        type="date"
                        id='FeesYear'
                        onChange={handleInput}
                        value={inputVal.Feesyear}
                        name="Feesyear" />
                </Form.Group>
                <Form.Group className="mb-3"  >
                    <Form.Label htmlFor='FeesAmount'>Fees Amount<sup>*</sup></Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="e.g:- 2000"
                        onChange={handleInput}
                        value={inputVal.FeesAmount}
                        name="FeesAmount" />
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
    const [AllClasses, setAllClasses] = useState([])
    const [inputVal, setinputVal] = useState({
        Class: "",
        FeesTitle: "",
        Feesyear: "",
        FeesAmount: "",
    })
    const ref = useRef()
    // update data get function
    const updataDataGet = async () => {
        const gettingAllClasses = await axios.get('http://localhost:5000/users');
        const { data } = await axios.get(`http://localhost:5000/users/${Id}`)
        setinputVal({ Class: data.name, FeesTitle: data.StudentAddress, Feesyear: data.StudnetBirthdate, FeesAmount: data.Amount })
        setAllClasses(gettingAllClasses.data)
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


    const submitData = (e) => {
        e.preventDefault();
        const {Class,FeesTitle,Feesyear,FeesAmount}=inputVal;
        console.log(Class,FeesTitle,Feesyear,FeesAmount);
    }
    return (
        <div className={style.MyUpdateCenterModel}>
            <div className={style.fullupdateform}>
                <div className={style.updateForm}>
                    <div className={style.Title}>
                        <h2>Update Fees <span>*</span></h2>
                        <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                    </div>
                    <div className={style.Form}>
                        <form className={style.AddFeeForm} onSubmit={submitData}>
                        <Form.Group className={style.inputLayer} >
                                <Form.Label htmlFor='Class'>Class<sup>change or leave</sup></Form.Label>
                                <Form.Select aria-label="Default select example" name="Class" onChange={handleInput} id='Class'>
                                    <option>Select Class here...</option>
                                    {AllClasses.map((val, index, arr) => {
                                        return (<option value={val.name} key={index}>{val.name}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <div className={style.inputLayer}>
                                <label htmlFor="Title">Update Title <sup>*</sup></label>
                                <input type="text"
                                    id='Title'
                                    name="FeesTitle"
                                    placeholder="Ex. Education Fee (2022)"
                                    onChange={handleInput}
                                    value={inputVal.FeesTitle} />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor="date">update Date <sup>change or leave</sup></label>
                                <input
                                    type="date"
                                    id='FeesYear'
                                    onChange={handleInput}
                                    value={inputVal.Feesyear}
                                    name="Feesyear" />
                            </div>
                          
                            <div className={style.inputLayer}>
                                <Form.Label htmlFor='FeesAmount'>Fees Amount<sup>*</sup></Form.Label>
                                    <Form.Control
                                       type="number"
                                       placeholder="e.g:- 2000"
                                       onChange={handleInput}
                                       value={inputVal.FeesAmount}
                                       name="FeesAmount"
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

const Fee = () => {
    const { status } = useSelector((state) => { return state.controls })
    const [modalShow, setModalShow] = useState(false);
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
    }, [])
    // load user data
    const loadUserData = async (start, end, increase, optType = null, filterOrSort) => {
        // combinig it with search functionality
        switch (optType) {
            case "search":
                setoperation(optType)
                setSortValue("")
                const readDatawithSearchQuery = await axios.get(`http://localhost:5000/users?q=${inputVal}&_start=${start}&_end=${end}`);
                setdata(readDatawithSearchQuery.data)
                // setinputVal("")
                setCurrentPage(CurrentPage + increase)
                break;

            case "sort":
                setoperation(optType)
                setSortValue(filterOrSort)
                const sortData = await axios.get(`http://localhost:5000/users?_sort=${sortFilterVal}&_order=asc&_start=${start}&_end=${end}`);
                setdata(sortData.data)
                setCurrentPage(CurrentPage + increase)
                break;

            default:
                const firstOnlyReadDatafour = await axios.get(`http://localhost:5000/users?_start=${start}&_end=${end}`);//_start and _end help to get specific data
                setdata(firstOnlyReadDatafour.data)
                setCurrentPage(CurrentPage + increase)
                break;
        }
        const fullData = await axios.get("http://localhost:5000/users");
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

    const sortOptions = ["name", "fee", "id"];
    // sorting fnction
    const handleSort = async (e) => {
        let value = e.target.value;
        setSortValue(value)
        loadUserData(0, 4, 0, "sort", value)
    }
    return (
        <div className={style.FeeDashboardWrapper}>
            <Sidebar ToggleStatus={status} />

            <div className={status ? style.FeePageSmall : style.FeePageFull}>


                <div className={style.FeePageContainer}>
                    <div className={style.FeePageTopPart}>
                        <Button variant="primary" onClick={() => {
                            setModalShow(true)
                            Modelrender = true
                        }}>
                            Add Fees <AddIcon className={style.btnPlusIcon} />
                        </Button>

                        {Modelrender === true ? <MyVerticallyCenteredModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                        /> : ""}
                    </div>
                    <div className={style.wrapMidPar}>
                        <div className={style.FeePageMidPart}>
                            <h1>Manage Fees</h1>
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
                                            <th>Title</th>
                                            <th>Fees year</th>
                                            <th>Amount</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length === 0 ?
                                            <tr>
                                                <td colSpan={6}>No Data Found</td>
                                            </tr> :
                                            data.map((val, index, arr) => {
                                                if (val !== undefined) {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{val.id}</td>
                                                            <td>{val.name}</td>
                                                            <td>{val.StudentAddress}</td>
                                                            <td>{val.StudnetBirthdate}</td>
                                                            <td>{val.fee}</td>

                                                            <td>
                                                                <div className={style.actionsALign}>
                                                                    <DriveFileRenameOutlineOutlinedIcon className={style.edit} onClick={() => {
                                                                        classID = val.id
                                                                        setupdateModelShow(true)
                                                                    }} />
                                                                    <CloseRoundedIcon className={style.delete} />
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

    )
}

export default Fee