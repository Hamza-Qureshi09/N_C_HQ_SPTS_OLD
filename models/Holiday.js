const mongoose=require("mongoose")


const HolidaySchema=new mongoose.Schema({
    Title:{type:String,required:true},
    StartDate:{type:Date},
    EndDate:{type:Date},
    allDay: {type:Boolean,default:true},
})

const Holiday=new mongoose.model("Holiday",HolidaySchema);

module.exports=Holiday
