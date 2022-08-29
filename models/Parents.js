const mongoose=require("mongoose")
const Schema=mongoose.Schema

const ParentSchema=new mongoose.Schema({
    Pname:{type:String,required:true},
    Pemail:{type:String,required:true},
    Ppassword:{type:String,required:true},
    childs:[
        {
            type:Schema.Types.ObjectId,
            ref:'Student',
            required:false
        }
    ]
},{timestamps:true})

const Parent=new mongoose.model("Parent",ParentSchema);

module.exports=Parent
