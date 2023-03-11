import React, { useState, useEffect, useRef } from 'react'
import style from './Holiday.module.scss'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from '../../../components/Shared/Sidebar/Sidebar'
import Navbar from '../../../components/Shared/Navbar/Navbar'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import AddIcon from '@mui/icons-material/Add';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';




let HolidayEvent = {
    title: "",
    startDate: "",
    endDate: "",
};
let makeSysUptodateID;
let Modelrender = false;
function MyVerticallyCenteredModal(props) {
    Modelrender = false;
    const [NewHoliday, setNewHoliday] = useState(
        {
            title: "",
            startDate: "",
            endDate: "",
        })


    const handleInput = (e) => {
        const { name, value } = e.target;
        setNewHoliday((preVal) => {
            return {
                ...preVal,
                [name]: value
            }
        })
    }
    const submitData = async (e) => {
        e.preventDefault();
        const { title, startDate, endDate } = NewHoliday;
        if (!title || !startDate || !endDate) {
            return window.alert("Please fill all the fields first!")
        }
        const response = await axios.post("/api/Manage/AddHoliday", {
            title, startDate, endDate
        }, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            withCredentials: true
        })
        if (response.status === 200) {
            props.onHide()
            makeSysUptodateID = title
            return window.alert("Holiday added successfully!")
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
                <Modal.Title id="contained-modal-title-vcenter" className={style.AddHolidayFormTitle}>
                    Add New Holiday 🚀
                    <span>(For example 14 August,etc...)</span>
                </Modal.Title>
            </Modal.Header>
            <Form className={style.AddHolidayForm} onSubmit={submitData}>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='title'>Holiday Title <sup>*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Holiday name"
                        onChange={handleInput}
                        value={NewHoliday.title}
                        name="title"
                        id='title' />
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='startDate'>StartDate & Time <sup>*</sup></Form.Label>
                    <Form.Control
                        type="datetime-local"
                        onChange={handleInput}
                        value={NewHoliday.startDate}
                        name="startDate"
                        id='startDate' />
                </Form.Group>
                <Form.Group className="mb-3"   >
                    <Form.Label htmlFor='endDate'>EndDate & Time <sup>*</sup></Form.Label>
                    <Form.Control
                        type="datetime-local"
                        onChange={handleInput}
                        value={NewHoliday.endDate}
                        name="endDate"
                        id='endDate' />
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




const DataUPdateModel = ({ HolidayEvent, onHide }) => {
    const [NewHoliday, setNewHoliday] = useState(
        {
            title: HolidayEvent.title,
            startDate: moment(new Date(HolidayEvent.startDate)).format("yyyy-MM-DDThh:mm"),
            endDate: moment(new Date(HolidayEvent.endDate)).format("yyyy-MM-DDThh:mm"),
        })
    // const ref = useRef()


    const handleInput = (e) => {
        const { name, value } = e.target;
        setNewHoliday((preVal) => {
            return {
                ...preVal,
                [name]: value
            }
        })
    }
    const submitData =async (e) => {
        e.preventDefault();
        const { title, startDate, endDate } = NewHoliday;
        // update data get function
        if (!title || !startDate || !endDate) {
            return window.alert("Please fill all the fields first!")
        }
        const responce=await axios.post("/api/Manage/upldateHoliday",
        {Id:HolidayEvent.id,title,startDate,endDate},
        { headers:{
            "Content-Type":"application/json",      
            Accept:"application/json"   
        },
        withCredentials:true})
        if(responce.status===200){
            onHide()
            makeSysUptodateID=title
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
                        <h2>Update Holiday <span>*</span></h2>
                        <CloseRoundedIcon onClick={onHide} className={style.formClose} />
                    </div>
                    <div className={style.Form}>
                        <form className={style.AddHolidayForm} onSubmit={submitData}>
                            <div className={style.inputLayer}>
                                <label htmlFor='title'>Title <sup>*</sup></label>
                                <input
                                    type="text"
                                    placeholder="Enter Title"
                                    onChange={handleInput}
                                    value={NewHoliday.title}
                                    name="title"
                                    id='title' />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='startDate'>StartDate & Time<sup>change or leave</sup></label>
                                <input
                                    type="datetime-local"
                                    onChange={handleInput}
                                    value={NewHoliday.startDate}
                                    name="startDate"
                                    id='startDate' />
                            </div>
                            <div className={style.inputLayer}>
                                <label htmlFor='endDate'>EndDate & Time<sup>change or leave</sup></label>
                                <input
                                    type="datetime-local"
                                    onChange={handleInput}
                                    value={NewHoliday.endDate}
                                    name="endDate"
                                    id='endDate' />
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



const Holiday = () => {
    const { status } = useSelector((state) => { return state.controls })
    const [modalShow, setModalShow] = useState(false);
    const [updateModelShow, setupdateModelShow] = useState(false);
    const [NewHoliday, setNewHoliday] = useState([])

    const locales = {
        "en-US": require("date-fns/locale/en-US")
    }

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales
    })


    const ref = useRef()
    ref.current = false
    // update data get function
    const GetHolidayInfo = async () => {
        const responce = await axios.get(`/api/Manage/GetHoliday`)
        if (responce.status === 200) {
            const data = responce.data
            setNewHoliday(data)
        }
    }
    useEffect(() => {
        if (ref.current === true && HolidayEvent !== undefined) {
            GetHolidayInfo()
        }
        return () => {
            ref.current = true
        }
    }, [makeSysUptodateID])


    return (
        <>
            <Navbar />
            <div className={style.HolidayDashboardWrapper}>
                <Sidebar ToggleStatus={status} />

                <div className={status ? style.HolidayPageSmall : style.HolidayPageFull}>


                    <div className={style.HolidayPageContainer}>
                        <div className={style.HolidayPageTopPart}>
                            <Button variant="primary" onClick={() => {
                                setModalShow(true)
                                Modelrender = true
                            }}>
                                Add Holiday <AddIcon className={style.btnPlusIcon} />
                            </Button>

                            {Modelrender === true ? <MyVerticallyCenteredModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                            /> : ""}
                        </div>
                        <div className={style.wrapMidPar}>
                            <div className={style.HolidayPageMidPart}>
                                <h1>Holiday's</h1>
                                <div className={style.table}>
                                    <Calendar localizer={localizer}
                                        selectable={true}
                                        resizable={true}
                                        popup={true}
                                        onSelectEvent={(event) => {
                                            HolidayEvent = event;
                                            setupdateModelShow(true)
                                        }} // on event click trigger
                                        events={NewHoliday}
                                        startAccessor="startDate"
                                        endAccessor="endDate" style={{ height: "500px", margin: "5px", backgroundColor: "white" }}

                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {updateModelShow === true ?
                    <DataUPdateModel HolidayEvent={HolidayEvent} onHide={() => setupdateModelShow(false)} /> : ""}
            </div>
        </>
    )
}

export default Holiday