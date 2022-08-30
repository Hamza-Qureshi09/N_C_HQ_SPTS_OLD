const mongoose=require("mongoose")
const Schema=mongoose.Schema

const StudentSchema=new mongoose.Schema({
    Sname:{ type:String, required:true },
    Saddress:{ type:String, required:true },
    Srollno:{ type:Number, required:true },
    Sbirthdate:{ type:Date},
    Sphone:{ type:Number, required:true },
    Sgender:{ type:String},
    SparentDetails:[{
        type:String,
        required:false
    }
    ],
    Sclass:[
        {
        type:String,
        required:false
    }
    ],
    Sfeestatus:{ type:String, required:true },
    Sfeeamount:{ type:Number, required:false,default:0},
    Spicture:{ type:String,required:false },
    Smarks:[
        {
            Title:{type:String, required:false},
            Class:{type:String, required:false},
            Subject:{type:String, required:false},
            TotalMarks:{type:String, required:false},
            ObtainMarks:{type:String, required:false},
        }
    ],
    Sattendence:[
        {
            Status:{type:String, required:false},
            Date:{type:Date}
        }
    ]
},{timestamps:true})

const Student=new mongoose.model("Student",StudentSchema);

module.exports=Student
