const mongoose=require("mongoose")
const Schema=mongoose.Schema

const SubjectsSchema=new mongoose.Schema({
    SubjClass:{
        type:String,
        required:true
    },
    Time:{
        type:Date,
        // default:new Date()
    },
    Subjectname:{
        type:String,
        required:true
    }
})

const Subjects=new mongoose.model("Subjects",SubjectsSchema);

module.exports=Subjects
