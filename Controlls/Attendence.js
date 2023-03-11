const userModel = require("../models/user")
const classModel = require("../models/Class")
const studentModel = require("../models/Student")

class Attendence {
    // validate User for attendence
    async validateUser(req, res) {
        const { ValidEmail, ValidPassword, role, findClass } = req.body;
        if (!ValidEmail || !ValidPassword) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        if (role === "Teacher") {
            const matchUser = await userModel.findOne({ Useremail: ValidEmail, Password: ValidPassword })
            if (matchUser) {
                const fetchclassStudents = await classModel.findOne({ Cname: findClass }).populate("Cstudents")
                console.log(fetchclassStudents.Cstudents)
                return res.status(200).json(fetchclassStudents.Cstudents.map((val) => {
                    return (
                        {
                            id: val._id,
                            StudentPicture: val.Spicture ? val.Spicture : "",
                            StudentName: val.Sname ? val.Sname : "",
                            StudentRollno: val.Srollno ? val.Srollno : "",
                        }
                    )
                }))
            }
            return res.status(400).json({ message: "Invalid credentials" })
        }
    }


    // mark attendence
    async MarkAttendence(req, res) {
        const { status, Id } = req.body;
        console.log(status);
        if (status) {
            const attendence = await studentModel.findByIdAndUpdate(
                { _id: Id },
                {
                    $push: {
                        Sattendence: {
                            Status: status,
                            Date: new Date(Date.now())
                        }
                    }
                },
                { new: true, upsert: true }
            )
            console.log(attendence)
            res.status(200).json("Successfully marked!")
        }
    }


    // getting students
    async GetStudents(req, res) {
        const query = req.query
        // console.log(query)
        if (query) {
            const students = await classModel.findOne(
                { Cname: query.className }
                ).populate('Cstudents')
                res.status(200).json({Students:students?students.Cstudents:[]})
        }
    }


    // getting single student
    async GetSingleStudent(req, res) {
        const query = req.query.studentname
        let Sname=query.split("(");
        let Srollno=Sname[1].split(")");
        if (query) {
            const students = await studentModel.findOne(
                {Srollno:Srollno[0] }
                )
            const PresentStudents = await studentModel.findOne({Srollno:Srollno[0] });
            // , { Sattendence: { $elemMatch: { "Sattendence.Status": "present"} }
                res.status(200).json({
                    StudentName:students.Sname,
                    StudentRollno:students.Srollno,
                    Presents:PresentStudents.Sattendence.length,
                    // Leaves:students.Leaves
                })
        }
    }
}
module.exports = new Attendence()