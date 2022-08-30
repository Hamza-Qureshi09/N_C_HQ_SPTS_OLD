const mongoose=require("mongoose")
const Schema=mongoose.Schema

const AppointementSchema=new mongoose.Schema({
    ClassId:{type:String},
    title:{type:String},
    Role:{type:String},
    Appointmentwith:{type:String,required:true},
    endDate:{type:Date},
    startDate:{type:Date},
    Description:{type:String,required:false},
    Status:{type:String,required:false,enum:['Approved','Reject','Pending'],default:'Pending'},
    allDay:{type:Boolean,defaule:false},
    RequestFrom:{type:String}
})

const Appointement=new mongoose.model("Appointement",AppointementSchema);

module.exports=Appointement
