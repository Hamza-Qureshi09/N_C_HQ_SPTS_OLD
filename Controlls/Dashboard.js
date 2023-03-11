const classModel=require("../models/Class")
const studentModel=require("../models/Student")
const eventModel=require("../models/Events")
const teacherModel=require("../models/Teacher")
const examModel=require("../models/Exams")
const holidayModel=require("../models/Holiday")
// school info 
// student info 
// teacher info
//  exam info 
// holidays info sorted
// event info
class Dashboard{
    // fetching things
    async GetInfo(req,res){
        const Classes=await classModel.find({}).count()
        const Students=await studentModel.find({}).count()
        const Events=await eventModel.find({}).count()
        const Event=await eventModel.find({})
        const Teachers=await teacherModel.find({}).count()
        const Exams=await examModel.find({}).count()
        const Holidays=await holidayModel.find({}).count()
        const Holiday=await holidayModel.find({})
        // console.log(Classes,Students,Events,Teachers,Exams,Holidays,Event);
        res.status(200).json({
            Classes,Students,Events,Teachers,Exams,Holidays,Event,Holiday
        })
    }

}
module.exports=new Dashboard()