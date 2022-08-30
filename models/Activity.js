const mongoose=require("mongoose")
// const Schema=mongoose.Schema


const ActivitySchema=new mongoose.Schema({
    Title:{type:String,required:true},
    Class:{type:String,required:true},
    Date:{type:Date},
    Description:{type:String,required:false}
})

const Activity=new mongoose.model("Activity",ActivitySchema);

module.exports=Activity
