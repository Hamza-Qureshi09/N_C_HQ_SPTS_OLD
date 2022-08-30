const mongoose=require("mongoose")

const TeacherSchema=new mongoose.Schema({
    Tname:{ type:String, required:true },
    Taddress:{ type:String, required:true },
    Tclasses:[{
        type:String,
        required: false
    }],
    Tbirthdate:{ type:Date,  },
    Tphone:{ type:Number, required:true },
    Teducation:{ type:String, required:true },
    Tgender:{ type:String},
    Tmartialstatus:{ type:String},
    Temail:{ type:String, required:true },
    Tpassword:{ type:String, required:true },
    Tsalary:{ type:Number, required:true },
    Tpicture:{ type:String },
    Tremarks:{ type:String },
},{timestamps:true})

const Teacher=new mongoose.model("Teacher",TeacherSchema);

module.exports=Teacher
