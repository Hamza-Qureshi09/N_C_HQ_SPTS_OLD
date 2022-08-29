const mongoose=require("mongoose")

const EventSchema=new mongoose.Schema({
    Title:{type:String,required:true},
    StartDate:{type:Date,default:new Date()},
    EndDate:{type:Date,default:new Date()},
    Description:{type:String,required:false},
    EventPicture:{type:String,required:false},
},{timestamps:true})

const Event=new mongoose.model("Event",EventSchema);

module.exports=Event
