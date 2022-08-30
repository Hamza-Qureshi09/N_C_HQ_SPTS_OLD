const mongoose=require("mongoose")

const feedbackSchema=new mongoose.Schema({
    ParentInfo:{type:String,required:true},
    Student:{type:String,required:true},
    Subject:{type:String,required:true},
    Feedback:{type:String,required:false}, 
    Class:{type:String,required:false}, 
})



const Feedback=new mongoose.model("Feedback",feedbackSchema);  

module.exports=Feedback
