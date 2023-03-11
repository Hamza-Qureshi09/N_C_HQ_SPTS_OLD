import React, { useState, useEffect, useRef } from 'react'
import style from './Teacher.module.scss'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Navbar from '../../../components/Shared/Navbar/Navbar'
import Sidebar from '../../../components/Shared/Sidebar/Sidebar'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Table from 'react-bootstrap/Table';
import AddIcon from '@mui/icons-material/Add';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import moment from "moment"




let TeacherID;
let Modelrender = false;
let makeSysUptodateID;
function MyVerticallyCenteredModal(props) {
    const [activeGender, setactiveGender] = useState("hide")
    const [activeMartialStatus, setactiveMartialStatus] = useState("hide")
    const [imageSelct, setimageSelct] = useState("")
    Modelrender = false;
    const [inputVal, setinputVal] = useState({
        Teachername: "",
        TeacherAddress: "",
        TeacherBirthdate: "",
        TeacherPhone: "",
        Education: "",
        Gender: "",
        martialStatus: "",
        TeacherEmail: "",
        SetTeacherPassword: "",
        Salary: "",
        Remarks: "",
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


    const submitData =async (e) => {
        e.preventDefault();
        const { Teachername, TeacherAddress, TeacherBirthdate, TeacherPhone, Education, Gender, martialStatus, TeacherEmail, SetTeacherPassword, Salary, Remarks } = inputVal;
        if(!Teachername|| !TeacherAddress|| !TeacherBirthdate|| !TeacherPhone|| !Education|| !Gender|| !martialStatus|| !TeacherEmail|| !SetTeacherPassword|| !Salary){
            return window.alert("Please fill all the fields first!")
        }
        const responce=await axios.post("/api/Manage/AddTeacher",
        {Teachername, TeacherAddress, TeacherBirthdate, TeacherPhone, Education, Gender, martialStatus, TeacherEmail, SetTeacherPassword, Salary, Remarks, TeacherImage:imageSelct?imageSelct:""},
        {
            headers:{
                "Content-Type":"application/json",
                Accept:"application/json"
            },withCredentials:true
        })
        if(responce.status===200){
            props.onHide()
            makeSysUptodateID=Teachername
            return window.alert("Successfully Registered!");
        }else{
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
                <Modal.Title id="contained-modal-title-vcenter" className={style.AddTeacherFormTitle}>
                    Add Teacher
                    {/* <span>(For example 1,2,3-A,etc...)</span> */}
                </Modal.Title>
            </Modal.Header>
            <Form className={style.AddTeacherForm} onSubmit={submitData}>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='name'>Teacher Name <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Teacher name"
                        onChange={handleInput}
                        value={inputVal.Teachername}
                        name="Teachername"
                        id='name' />
                </Form.Group>

                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='TeacherAddress'>Teacher Address <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Address here.."
                        onChange={handleInput}
                        value={inputVal.TeacherAddress}
                        name="TeacherAddress"
                        id='TeacherAddress' />
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='TeacherBirthdate'>Teacher Birthdate <sup>*</sup></Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="Enter Subject name"
                        onChange={handleInput}
                        value={inputVal.TeacherBirthdate}
                        name="TeacherBirthdate"
                        id='TeacherBirthdate' />
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='TeacherPhone'>Teacher Phone <sup>*</sup></Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="+923170816287"
                        onChange={handleInput}
                        value={inputVal.TeacherPhone}
                        name="TeacherPhone"
                        id='TeacherPhone' />
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='Education'>Teacher Education <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="BS-IT"
                        onChange={handleInput}
                        value={inputVal.Education}
                        name="Education"
                        id='Education' />
                </Form.Group>
                <Form.Group className={style.TeacherFormAlign} >
                    <b>Gender</b> <sup>*</sup>
                    <div className={style.TeacherFormAlignItems}>
                        <div className={style.TeacherformAlignitem}>
                            <Form.Label htmlFor='male'>Male </Form.Label>
                            <Form.Control className={`${activeGender === "true" ? style.activeGenderRadio : ""}`}
                                type="radio"
                                value="male"
                                name="Gender"
                                onChange={handleInput}
                                onClick={() => setactiveGender("true")}
                                id='male' />
                        </div>
                        <div className={style.TeacherformAlignitem}>
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


                <Form.Group className={style.TeacherFormAlign} >
                    <b>Martial Status</b> <sup>*</sup>
                    <div className={style.TeacherFormAlignItems}>
                        <div className={style.TeacherformAlignitem}>
                            <Form.Label htmlFor='Single'>Single </Form.Label>
                            <Form.Control className={`${activeMartialStatus === "true" ? style.activeGenderRadio : ""}`}
                                type="radio"
                                value="Single"
                                name="martialStatus"
                                onChange={handleInput}
                                onClick={() => setactiveMartialStatus("true")}
                                id='Single' />
                        </div>
                        <div className={style.TeacherformAlignitem}>
                            <Form.Label htmlFor='Married'>Married</Form.Label>
                            <Form.Control className={`${activeMartialStatus === "false" ? style.activeGenderRadio : ""}`}
                                type="radio"
                                value="Married"
                                name="martialStatus"
                                onChange={handleInput}
                                onClick={() => setactiveMartialStatus("false")}
                                id='Married' />
                        </div>
                    </div>
                </Form.Group>

                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='TeacherEmail'>Teacher Email <sup>*</sup></Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="asdf@gmail.com"
                        onChange={handleInput}
                        value={inputVal.TeacherEmail}
                        name="TeacherEmail"
                        id='TeacherEmail' />
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='TeacherPassword'>Set Teacher Password <sup>*</sup></Form.Label>
                    <Form.Control
                        type="password"
                        onChange={handleInput}
                        value={inputVal.SetTeacherPassword}
                        name="SetTeacherPassword"
                        id='TeacherPassword' />
                </Form.Group>



                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='StudentFeeAmount'>Salary <sup>*</sup></Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="3000"
                        onChange={handleInput}
                        value={inputVal.Salary}
                        name="Salary"
                        id='StudentFeeAmount' />
                </Form.Group>

                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='TeacherPicture'>Teacher Picture <sup>(optional)</sup></Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFile}
                        accept="image/png , image/jpg , image/jpeg"
                        id='TeacherPicture' />
                </Form.Group>
                <Form.Label htmlFor='Remarks'>Remarks <sup>(optional)</sup></Form.Label>
                <FloatingLabel id="Remarks" label="Remarks">
                    <Form.Control
                        as="textarea"
                        name="Remarks"
                        id="Remarks"
                        value={inputVal.Remarks}
                        onChange={handleInput}
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
        </Modal >
    );
}




const DataUPdateModel = ({ Id, onHide }) => {
    const [AllClasses, setAllClasses] = useState([])
    const [imageSelct, setimageSelct] = useState("")
    const [inputVal, setinputVal] = useState({
        Teachername: "",
        TeacherAddress: "",
        Class: "",
        TeacherBirthdate: "",
        TeacherPhone: "",
        Education: "",
        Gender: "",
        martialStatus: "",
        TeacherEmail: "",
        SetTeacherPassword: "",
        Salary: "",
        Remarks: "",
        TeacherImage:""
    })
    const ref = useRef()
    // update data get function
    const updataDataGet = async () => {
        const { data } = await axios.get(`/api/Manage/GetTeacher/${Id}`)
        const responce = await axios.get(`/api/Manage/GetClass`)
        setAllClasses(responce.data)
        setinputVal({ Teachername: data.Teachername, TeacherAddress: data.TeacherAddress, TeacherBirthdate: moment(new Date(data.TeacherBirthdate)).format("YYYY-MM-DD"), TeacherPhone: data.TeacherPhone, Education: data.Education,Gender:data.Gender,martialStatus:data.martialStatus, TeacherEmail: data.TeacherEmail, SetTeacherPassword: data.SetTeacherPassword, Salary: data.Salary, Remarks: data.Remarks,TeacherImage:data.TeacherImage?data.TeacherImage:"" })
    }
    useEffect(() => {
        if (ref.current === true && TeacherID !== undefined) {
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
        const { Teachername, TeacherAddress,Class, TeacherBirthdate, TeacherPhone, Education, Gender, martialStatus, TeacherEmail, SetTeacherPassword, Salary, Remarks,TeacherImage } = inputVal;
        if(!Teachername|| !TeacherAddress|| !TeacherBirthdate|| !TeacherPhone|| !Education|| !TeacherEmail|| !SetTeacherPassword|| !Salary){
            return window.alert("fill all the neccessary fields first!")
        }

        const responce=await axios.post("/api/Manage/GetTeacher/updateTeacher",
        {Id,Teachername, TeacherAddress,Class, TeacherBirthdate, TeacherPhone, Education, Gender, martialStatus, TeacherEmail, SetTeacherPassword, Salary, Remarks,TeacherImage:TeacherImage?TeacherImage:null, imageSelct:imageSelct?imageSelct:null},
        { headers:{
            "Content-Type":"application/json",      
            Accept:"application/json"   
        },
        withCredentials:true})
        if(responce.status===200){
            onHide()
            makeSysUptodateID=Teachername
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
                        <h2>Update Teacher <span>*</span></h2>
                        <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                    </div>
                    <div className={style.Form}>
                        <form className={style.AddTeacherForm} onSubmit={submitData}>
                            <div className={style.inputLayer}>
                                <label htmlFor='Teachername'>Teacher Name <sup>*</sup></label>
                                <input
                                    type="text"
                                    placeholder="Enter Student name"
                                    onChange={handleInput}
                                    value={inputVal.Teachername}
                                    name="Teachername"
                                    id='Teachername' />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='TeacherAddress'>Teacher Address <sup>*</sup></label>
                                <input
                                    type="text"
                                    placeholder="Address here.."
                                    onChange={handleInput}
                                    value={inputVal.TeacherAddress}
                                    name="TeacherAddress"
                                    id='TeacherAddress' />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='Class'>Assign Class <sup>*</sup></label>
                                <select name="Class" onChange={handleInput} id='Class'>
                                <option>Select Class here...</option>
                                {AllClasses.map((val, index, arr) => {
                                    return (<option value={val.className} key={index}>{val.className}</option>)
                                })}
                            </select>
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='TeacherBirthdate'>Teacher Birthdate<sup>change or leave</sup></label>
                                <input
                                    type="date"
                                    onChange={handleInput}
                                    value={inputVal.TeacherBirthdate}
                                    name="TeacherBirthdate"
                                    id='TeacherBirthdate' />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='StudnetPhone'>Teacher Phone <sup>*</sup></label>
                                <input
                                    type="number"
                                    placeholder="+923170816287"
                                    onChange={handleInput}
                                    value={inputVal.TeacherPhone}
                                    name="TeacherPhone"
                                    id='TeacherPhone' />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='Education'>Teacher Education <sup>*</sup></label>
                                <input
                                    type="text"
                                    placeholder="BS-IT"
                                    onChange={handleInput}
                                    value={inputVal.Education}
                                    name="Education"
                                    id='Education' />
                            </div>
                            <div className={style.TeacherFormAlign}>
                                <b>Gender</b> <sup>*</sup>
                                <div className={style.TeacherFormAlignItems}>
                                    <div className={style.TeacherformAlignitem}>
                                        <label htmlFor='male'>Male</label>
                                        <input
                                            type="radio"
                                            value="male"
                                            name="Gender"
                                            onChange={handleInput}
                                            id='male' />
                                    </div>

                                    <div className={style.TeacherformAlignitem}>
                                        <label htmlFor='female'>Female</label>
                                        <input
                                            type="radio"
                                            value="female"
                                            name="Gender"
                                            onChange={handleInput}
                                            id='female' />
                                    </div>
                                </div>
                            </div>

                            <div className={style.TeacherFormAlign}>
                                <b>Martial Status</b> <sup>*</sup>
                                <div className={style.TeacherFormAlignItems}>
                                    <div className={style.TeacherformAlignitem}>
                                        <label htmlFor='Single'>Single</label>
                                        <input
                                            type="radio"
                                            value="Single"
                                            name="martialStatus"
                                            onChange={handleInput}
                                            id='Single' />
                                    </div>

                                    <div className={style.TeacherformAlignitem}>
                                        <label htmlFor='Married'>Married</label>
                                        <input
                                            type="radio"
                                            value="Married"
                                            name="martialStatus"
                                            onChange={handleInput}
                                            id='Married' />
                                    </div>
                                </div>
                            </div>

                            <Form.Group className={style.inputLayer}   >
                                <Form.Label htmlFor='TeacherEmail'>Teacher Email <sup>change or leave</sup></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="asdf@gmail.com"
                                    onChange={handleInput}
                                    value={inputVal.TeacherEmail}
                                    name="TeacherEmail"
                                    id='TeacherEmail' />
                            </Form.Group>
                            <Form.Group className={style.inputLayer}   >
                                <Form.Label htmlFor='TeacherPassword'>Set Teacher Password <sup>change or leave</sup></Form.Label>
                                <Form.Control
                                    type="password"
                                    onChange={handleInput}
                                    value={inputVal.SetTeacherPassword}
                                    name="SetTeacherPassword"
                                    id='TeacherPassword' />
                            </Form.Group>

                            <Form.Group className={style.inputLayer}   >
                                <Form.Label htmlFor='Salary'>Salary <sup>change or leave</sup></Form.Label>
                                <Form.Control
                                    type="number"
                                    onChange={handleInput}
                                    value={inputVal.Salary}
                                    name="Salary"
                                    id='Salary' />
                            </Form.Group>

                            <Form.Group className={style.inputLayer}   >
                                <Form.Label htmlFor='StudentPicture'>Student Picture <sup>change or leave</sup></Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleFile}
                                    accept="image/png , image/jpg , image/jpeg"
                                    id='TeacherPicture' />
                            </Form.Group>
                            <Form.Group className={style.inputLayer}   >
                                <Form.Label htmlFor='Remarks'>Remarks <sup>(optional)</sup></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="Remarks"
                                    id="Remarks"
                                    onChange={handleInput}
                                    value={inputVal.Remarks}
                                    placeholder="Leave a comment here"
                                    style={{ height: '100px', marginBottom: "10px", width: "100%" }}
                                />
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
const Teacher = () => {

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
                const readDatawithSearchQuery = await axios.get(`/api/Manage/GetTeacher?q=${inputVal}&_start=${start}&_end=${end}`);
                setdata(readDatawithSearchQuery.data)
                // setinputVal("")
                setCurrentPage(CurrentPage + increase)
                break;

            case "sort":
                setoperation(optType)
                setSortValue(filterOrSort)
                const sortData = await axios.get(`/api/Manage/GetTeacher?_sort=${filterOrSort}&_start=${start}&_end=${end}`);
                setdata(sortData.data)
                setCurrentPage(CurrentPage + increase)
                break;

            default:
                const firstOnlyReadDatafour = await axios.get(`/api/Manage/GetTeacher?_start=${start}&_end=${end}`);//_start and _end help to get specific data
                setdata(firstOnlyReadDatafour.data)
                setCurrentPage(CurrentPage + increase)
                break;
        }
        const fullData = await axios.get("/api/Manage/GetTeacher"); // for pagination setting out of pages 
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

    const sortOptions = ["id", "Teachername", "Salary"];
    // sorting fnction
    const handleSort = async (e) => {
        let value = e.target.value;
        setSortValue(value)
        loadUserData(0, 4, 0, "sort", value)
    }

        // delete data function
        const deleteData=async(Id,Classes,Image)=>{
            const responce=await axios.post("/api/Manage/GetTeacher/removeTeacher",{Id,Classes,Image},{
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
            <div className={style.TeacherDashboardWrapper}>
                <Sidebar ToggleStatus={status} />

                <div className={status ? style.TeacherPageSmall : style.TeacherPageFull}>


                    <div className={style.TeacherPageContainer}>
                        <div className={style.TeacherPageTopPart}>
                            <Button variant="primary" onClick={() => {
                                setModalShow(true)
                                Modelrender = true
                            }}>
                                Add Teacher <AddIcon className={style.btnPlusIcon} />
                            </Button>
                            {Modelrender === true ? <MyVerticallyCenteredModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            /> : ""}
                        </div>
                        <div className={style.wrapMidPar}>
                            <div className={style.TeacherPageMidPart}>
                                <h1>Teachers Record</h1>
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
                                                <th>Image</th>
                                                <th>Teachername</th>
                                                <th>TeacherAddress</th>
                                                <th>TeacherBirthdate</th>
                                                <th>TeacherPhone</th>
                                                <th>Education</th>
                                                <th>Classes</th>
                                                <th>Gender</th>
                                                <th>Martial Status</th>
                                                <th>TeacherEmail</th>
                                                <th>Password</th>
                                                <th>Salary</th>
                                                <th>Remarks</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.length === 0 ?
                                                <tr>
                                                    <td colSpan={15}>No Data Found</td>
                                                </tr> :
                                                data.map((val, index, arr) => {
                                                    if (val !== undefined) {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{val.id}</td>
                                                                 <td className={style.imageShape}>{val.TeacherImage?<img src={`/Storage/Teachers/${val.TeacherImage}`} alt="not found" />:<img  alt="not found" />}</td>
                                                                <td>{val.Teachername}</td>
                                                                <td>{val.TeacherAddress}</td>
                                                                <td>{ moment(new Date(val.TeacherBirthdate)).format("YYYY/MM/DD")}</td>
                                                                <td>{val.TeacherPhone}</td>
                                                                <td>{val.Education}</td>
                                                                <td className={style.classList}>{val.Classes.length===0?"NAN"
                                                                : 
                                                               <select>
                                                                {val.Classes.map((data,index,arr)=>{
                                                                    return(
                                                                        <option value={data} key={index}>{data}</option>
                                                                    )
                                                                })}
                                                               </select>
                                                                }</td>
                                                                <td>{val.Gender}</td>
                                                                <td>{val.martialStatus}</td>
                                                                <td>{val.TeacherEmail}</td>
                                                                <td>{`${val.SetTeacherPassword}`}</td>
                                                                <td>{`${val.Salary}`}</td>
                                                               
                                                                <td>{`${val.Remarks?val.Remarks:'NAN'}`}</td>
                                                                <td>
                                                                    <div className={style.actionsALign}>
                                                                        <DriveFileRenameOutlineOutlinedIcon className={style.edit} onClick={() => {
                                                                            TeacherID = val.id
                                                                            setupdateModelShow(true)
                                                                        }} />
                                                                        <CloseRoundedIcon className={style.delete}
                                                                        onClick={()=>{deleteData(val.id,val.Classes,val.TeacherImage)}} />
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
                    <DataUPdateModel Id={TeacherID} onHide={() => setupdateModelShow(false)} /> : ""}
            </div>
        </>
    )
}

export default Teacher