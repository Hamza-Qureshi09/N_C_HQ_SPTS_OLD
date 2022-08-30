const userModel=require("../models/user")
const studentModel=require("../models/Student")
const classModel=require("../models/Class")

class StudentReport{
    // validate User or parent
    async validateUser(req, res) {
        const { ValidEmail, ValidPassword, UserSearchFor} = req.body;
        let Sname = UserSearchFor.StudentName.split("(");
        let Roll = Sname[1].split(")");
        if (!ValidEmail || !ValidPassword) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
            const matchUser = await userModel.findOne({ Useremail: ValidEmail, Password: ValidPassword })
            if (matchUser) {
                console.log(Sname[0])
                const fetchStudent = await studentModel.findOne({Srollno:Roll[0]})
                const fetchClass = await classModel.findOne({Cname:UserSearchFor.ClassName})
                // const fetchExams=await examModel.findOne({})
                return res.status(200).json({
                    id:fetchStudent._id,
                    StudentName:fetchStudent.Sname,
                    StudentAddress:fetchStudent.Saddress,
                    Rollno:fetchStudent.Srollno,
                    Birthdate:fetchStudent.Sbirthdate,
                    StudentPhone:fetchStudent.Sphone,
                    Gender:fetchStudent.Sgender,
                    StudentPicture:fetchStudent.Spicture,
                    StudentAttendence:fetchStudent.Sattendence,
                    Class:fetchClass.Cname,
                    ParentInfo:fetchStudent.SparentDetails[0],
                    StudentMarks:fetchStudent.Smarks
                })
            }
            return res.status(400).json({ message: "Invalid credentials" })
    }

}
module.exports=new StudentReport();