const mongoose=require("mongoose")
const Schema=mongoose.Schema

const ExamSchema=new mongoose.Schema({
    Title:{type:String,required:true},
    Class:{type:String,required:true},
    Subject:{type:String,required:true},
    Date:{type:Date},
    Description:{type:String,required:false},
    TotalMarks:{type:String,required:false},
    FullClassResultPic:{type:String,required:false,default:""},
})

const Exam=new mongoose.model("Exam",ExamSchema);

module.exports=Exam
