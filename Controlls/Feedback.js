const feedbackModel=require("../models/Feedback")
const classModel=require("../models/Class")

class Feedback {

    // get Students
    async GetStudentsForFeedback(req, res) {
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

    // get Subjects
    async GetSubjectsForFeedback(req, res) {
        const query = req.query.className
        console.log(query)
        if (!query) {
            return res.status(400).json({ message: "Invalid entry" })
        }
        const Subjects = await classModel.findOne(
            { _id: query }
        ).populate('Csubjects')
        if (Subjects) {
            res.status(200).json(Subjects.Csubjects.map((val) => {
                return ({
                    Subjectname: val.Subjectname ? val.Subjectname : "",
                })
            }))
        }
    }


    // new appointement
    async AddNewFeedback(req, res) {
        // console.log(req.body)
        const {  Class, Student, Subject, FeedbackDescription,username } = req.body
        if (!Class || !Student || !Subject || !FeedbackDescription ) {
            return res.status(400).json({ message: "Invalid entry" })
        }
        let student = Student.split(",").join("");
        console.log(student)
        const NewFeedback = await feedbackModel({
            ParentInfo:username,
            Feedback:FeedbackDescription, 
            Student,
            Subject,
            Class, 
        }).save()
        if (NewFeedback) {
            return res.status(200).json("Feedback added")
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
module.exports = new Feedback()