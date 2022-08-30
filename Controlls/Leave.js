const classModel = require("../models/Class")
const leaveModel = require("../models/Leaves")

class Appointements {

    // get teachers
    async GetStudentsForLeave(req, res) {
        const query = req.query.className
        console.log(query)
        if (!query) {
            return res.status(400).json({ message: "Invalid entry" })
        }
        const Students = await classModel.findOne(
            { _id: query }
        ).populate('Cstudents')
        if (Students) {
            res.status(200).json(Students.Cstudents.map((val) => {
                return ({
                    Students: val.Sname ? val.Sname : "",
                    StudentRollno: val.Srollno ? val.Srollno : ""
                })
            }))
        }
    }


    // new appointement
    async NewLeave(req, res) {
        // console.log(req.body)
        const { Class, Student, startDate, endDate, title, DetailApplication, RequestedBy } = req.body
        if (!Class || !Student || !endDate || !DetailApplication || !title || !startDate || !RequestedBy) {
            return res.status(400).json({ message: "Invalid entry" })
        }
        let student = Student.split(",");
        // console.log(student[0],student[1])
        const NewLeave = await leaveModel({
            Class: Class ? Class : "",
            Student: student ? {Studentname:student[0],StudentRollno:student[1]} : "",
            title:title?title:"",
            RequestedBy: RequestedBy?RequestedBy:"",
            endDate: endDate ? endDate : "",
            startDate: startDate ? startDate : "",
            DetailApplication: DetailApplication ? DetailApplication : "",
        }).save()
        if (NewLeave) {
            return res.status(200).json("Leave added")
        }
        return res.status(400).json("error occured!")
    }


    // get appointments
    async GetLeaves(req, res) {
        const leaves = await leaveModel.find({});
        return res.status(200).json(leaves.map((val, index, arr) => {
            return (
                {
                    id: val._id,
                    Class: val.Class ? val.Class : "",
                    RequestedBy: val.RequestedBy ? val.RequestedBy : "",
                    startDate: val.startDate ? val.startDate : "",
                    endDate: val.endDate ? val.endDate : "",
                    DetailApplication: val.DetailApplication ? val.DetailApplication : "",
                    title: val.title ? val.title : "",
                    Status: val.Status ? val.Status : "",
                    Student: val.Student ? val.Student : "",
                }
            )
        }))
    }


    // update appointments
    async UpdateLeaves(req, res) {
        const { id, value,Role } = req.body
        const updateleaveStatus=await leaveModel.findOneAndUpdate(
            { _id: id},
            { Status: value,ApprovedBy:Role  }, { new: true, upsert: true });
            if(updateleaveStatus){
                return res.status(200).json("updated Successfully!")
            }
        return res.status(400).json("error in updation of document")
    }
}
module.exports = new Appointements()