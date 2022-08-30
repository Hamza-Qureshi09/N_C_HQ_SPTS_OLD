const classModel = require("../models/Class")
const appointmentModel = require("../models/Appointments")

class Appointements {

    // get teachers
    async GetTeachers(req, res) {
        const query = req.query.className
        console.log(query)
        if (!query) {
            return res.status(400).json({ message: "Invalid entry" })
        }
        const teachers = await classModel.findOne(
            { _id: query }
        ).populate('Cteacher')
        if (teachers) {
            res.status(200).json(teachers.Cteacher.map((val) => {
                return ({
                    Teachers: val.Tname ? val.Tname : ""
                })
            }))
        }
    }


    // new appointement
    async NewAppointement(req, res) {
        console.log(req.body)
        const { Class, AppointementWith, endDate, Description, title, startDate, RequestFrom } = req.body
        if (!Class || !AppointementWith || !endDate || !Description || !title || !startDate || !RequestFrom) {
            return res.status(400).json({ message: "Invalid entry" })
        }
        let Tname = AppointementWith.split("(");
        let Roll = Tname[1].split(")");
        const NewAppointment = await appointmentModel({
            ClassId: Class ? Class : "",
            title: title ? title : "",
            Role: Roll[0],
            Appointmentwith: Tname[0],
            endDate: endDate ? endDate : "",
            startDate: startDate ? startDate : "",
            Description: Description ? Description : "",
            RequestFrom: RequestFrom ? RequestFrom : "",
        }).save()
        if (NewAppointment) {
            return res.status(200).json("appointement added")
        }
        return res.status(400).json("error occured!")
    }


    // get appointments
    async GetAppointements(req, res) {
        const appointements = await appointmentModel.find({});
        return res.status(200).json(appointements.map((val, index, arr) => {
            return (
                {
                    id: val._id,
                    ClassId: val.ClassId ? val.ClassId : "",
                    Appointmentwith: val.Appointmentwith ? val.Appointmentwith : "",
                    startDate: val.startDate ? val.startDate : "",
                    endDate: val.endDate ? val.endDate : "",
                    Role: val.Role ? val.Role : "",
                    Description: val.Description ? val.Description : "",
                    allDay: val.allDay ? all.Day : "",
                    title: val.title ? val.title : "",
                    Status: val.Status ? val.Status : "",
                    RequestFrom: val.RequestFrom ? val.RequestFrom : "",
                }
            )
        }))
    }


    // update appointments
    async UpdateAppointement(req, res) {
        const { Id, value } = req.body
        const updateAppointementStatus=await appointmentModel.findOneAndUpdate(
            { _id: Id },
            { Status: value }, { new: true, upsert: true });
            if(updateAppointementStatus){
                return res.status(200).json("updated Successfully!")
            }
        return res.status(400).json("error in updation!")
    }
}
module.exports = new Appointements()