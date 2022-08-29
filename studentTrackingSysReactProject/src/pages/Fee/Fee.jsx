import React, { useState, useEffect, useRef } from 'react'
import style from './Fee.module.scss'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from '../../components/Shared/Sidebar/Sidebar'
import Navbar from '../../components/Shared/Navbar/Navbar'
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
import moment from 'moment'

let FeeId;
let Modelrender = false;
let makeSysUptodateID;
function MyVerticallyCenteredModal(props) {
    console.log("hamza")
    Modelrender = false;
    const [AllClasses, setAllClasses] = useState([])
    const [inputVal, setinputVal] = useState({
        Class: "",
        FeesTitle: "",
        Feesyear: "",
        FeesAmount: "",
    })


    const fetchAllClasses = async () => {
        const { data } = await axios.get('/api/Manage/GetClass');
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


    const submitData = async (e) => {
        e.preventDefault();
        const { Class, FeesTitle, Feesyear, FeesAmount } = inputVal;
        if (!Class || !FeesTitle || !Feesyear || !FeesAmount) {
            return window.alert("please fill all the fields first!")
        }
        const responce = await axios.post("/api/Manage/AddFee",
            { Class, FeesTitle, Feesyear, FeesAmount },
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                withCredentials: true
            })
        if (responce.status === 200) {
            props.onHide()
            makeSysUptodateID = Class
            return window.alert("successfully updated!");
        } else {
            return window.alert("error in update kindly try again!");
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
                <Modal.Title id="contained-modal-title-vcenter" className={style.AddFeeFormTitle}>
                    Add Fees Challan 💲<span>(For example Class 1 Fee, ABC Fee,etc...)</span>
                </Modal.Title>
            </Modal.Header>
            <Form className={style.AddFeeForm} onSubmit={submitData}>
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
    const [inputVal, setinputVal] = useState({
        Class: "",
        FeesTitle: "",
        Feesyear: "",
        FeesAmount: "",
    })
    const ref = useRef()
    // update data get function
    const updataDataGet = async () => {
        const { data } = await axios.get(`/api/Manage/GetFee/${Id}`)
        setinputVal({ Class: data.Class, FeesTitle: data.Title, Feesyear: moment(new Date(data.FeeYear)).format("YYYY-MM-DD"), FeesAmount: data.FeeAmount })
    }
    useEffect(() => {
        if (ref.current === true && FeeId !== undefined) {
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


    const submitData = async (e) => {
        e.preventDefault();
        const { Class, FeesTitle, Feesyear, FeesAmount } = inputVal;
        if (!Class || !FeesTitle || !Feesyear || !FeesAmount) {
            return window.alert("fill all the fields first!")
        }
        const responce = await axios.post("/api/Manage/updateFee",
            { Id, Class, FeesTitle, Feesyear, FeesAmount },
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                withCredentials: true
            })
        if (responce.status === 200) {
            onHide()
            makeSysUptodateID = FeesAmount
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
                        <h2>Update Fees <span>*</span></h2>
                        <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                    </div>
                    <div className={style.Form}>
                        <form className={style.AddFeeForm} onSubmit={submitData}>
                            <div className={style.inputLayer}>
                                <label htmlFor='Class'>Class<sup>change or leave</sup></label>
                                <input type="text"
                                    id='Class'
                                    name="Class"
                                    placeholder="Class 1"
                                    readOnly
                                    onChange={handleInput}
                                    value={inputVal.Class} />
                            </div>
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
    const Role = localStorage.getItem("Role")




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
                const readDatawithSearchQuery = await axios.get(`/api/Manage/getFees?q=${inputVal}&_start=${start}&_end=${end}`);
                setdata(readDatawithSearchQuery.data)
                // setinputVal("")
                setCurrentPage(CurrentPage + increase)
                break;

            case "sort":
                setoperation(optType)
                setSortValue(filterOrSort)
                const sortData = await axios.get(`/api/Manage/getFees?_sort=${filterOrSort}&_start=${start}&_end=${end}`);
                setdata(sortData.data)
                setCurrentPage(CurrentPage + increase)
                break;

            default:
                const firstOnlyReadDatafour = await axios.get(`/api/Manage/getFees?_start=${start}&_end=${end}`);//_start and _end help to get specific data
                setdata(firstOnlyReadDatafour.data)
                setCurrentPage(CurrentPage + increase)
                break;
        }
        const fullData = await axios.get("/api/Manage/getFees");
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

    const sortOptions = ["Class", "Amount", "id"];
    // sorting fnction
    const handleSort = async (e) => {
        let value = e.target.value;
        setSortValue(value)
        loadUserData(0, 4, 0, "sort", value)
    }

    // delete data function
    const deleteData = async (Id) => {
        const responce = await axios.post("/api/Manage/removeFeeChallan", { Id }, {
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
            <div className={style.FeeDashboardWrapper}>
                <Sidebar ToggleStatus={status} />

                <div className={status ? style.FeePageSmall : style.FeePageFull}>


                    <div className={style.FeePageContainer}>
                        {Role === "Parent" ? "" :
                            <div className={style.FeePageTopPart}>
                                <Button variant="primary" onClick={() => {
                                    setModalShow(true)
                                    Modelrender = true
                                }}>
                                    Fees Challan <AddIcon className={style.btnPlusIcon} />
                                </Button>

                                {Modelrender === true ? <MyVerticallyCenteredModal
                                    show={modalShow}
                                    onHide={() => setModalShow(false)}
                                /> : ""}
                            </div>
                        }

                        <div className={style.wrapMidPar}>
                            <div className={style.FeePageMidPart}>
                                {Role === "Admin" ?
                                    <>
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
                                                        <th>Title</th>
                                                        <th>Class</th>
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
                                                                        <td>{val.Title}</td>
                                                                        <td>{val.Class}</td>
                                                                        <td>{moment(new Date(val.FeeYear)).format("YYYY-MM-DD")}</td>
                                                                        <td>{val.FeeAmount}</td>

                                                                        <td>
                                                                            <div className={style.actionsALign}>
                                                                                <DriveFileRenameOutlineOutlinedIcon className={style.edit} onClick={() => {
                                                                                    FeeId = val.id
                                                                                    setupdateModelShow(true)
                                                                                }} />
                                                                                <CloseRoundedIcon className={style.delete} onClick={() => { deleteData(val.id) }} />
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
                                    </>
                                    :
                                    <div className={style.ParentSideView}>
                                        <h1>Latest News of Fees</h1>
                                        <div className={style.FeechallanContainer}>
                                            {data.length === 0 ?
                                                <h3>No Data Found!</h3> :
                                                data.map((val, index, arr) => {
                                                    return <div className={style.card} key={val.id}>
                                                        <div className={style.cardLeft}>
                                                            <h2>{val.Class}</h2>
                                                            <p>{val.Title}</p>
                                                            <b>{moment(new Date(val.FeeYear)).format("YYYY-MM-DD")}</b>
                                                        </div>
                                                        <div className={style.cardRight}>
                                                            <div className={val.FeeAmount<=1000? style.cardBadgeColord: val.FeeAmount<=3000?style.cardBadgedDiffer :style.cardBadge }></div>
                                                            <h1>{val.FeeAmount}</h1> <span>Pkr</span>
                                                        </div>
                                                    </div>
                                                })
                                            }

                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {updateModelShow === true ?
                    <DataUPdateModel Id={FeeId} onHide={() => setupdateModelShow(false)} /> : ""}
            </div>
        </>


    )
}

export default Fee