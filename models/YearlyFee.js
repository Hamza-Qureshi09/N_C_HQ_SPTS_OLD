const mongoose=require("mongoose")
const Schema=mongoose.Schema


const FeeSchema=new mongoose.Schema({
    Title:{type:String,required:true},
    Class:{ type:String,required:true},
    FeeYear:{type:Date},
    FeeAmount:{type:Number,required:true}
})

const Fee=new mongoose.model("Fee",FeeSchema);

module.exports=Fee
