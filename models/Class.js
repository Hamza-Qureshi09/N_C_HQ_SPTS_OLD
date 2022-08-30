const mongoose=require("mongoose")
const Schema=mongoose.Schema

const ClassSchema=new mongoose.Schema({
    Cname:{type:String,required:true,unique:true}, 
    Cfee:{type:Number,required:true},
    Cfeetitle:{type:String},
    Cyear:{type:String},
    Csubjects:[
       {
         type:Schema.Types.ObjectId,
         ref:'Subjects',
         required: false
        }
    ],
    Cstudents:[
        {
          type:Schema.Types.ObjectId,
          ref:'Student',
          required: false
         }
     ],
    Cteacher:[
        {
          type:Schema.Types.ObjectId,
          ref:'Teacher',
          required: false
         }
     ],
    Cexam:[
        {
          type:Schema.Types.ObjectId,
          ref:'Exam',
          required: false
         }
     ],
    Cactivity:[
        {
          type:Schema.Types.ObjectId,
          ref:'Activity',
          required: false
         }
     ],
    Cname:{type:String,required:true},
    Cname:{type:String,required:true},
    Cname:{type:String,required:true},
},{timestamps:true})

const Class=new mongoose.model("Class",ClassSchema);

module.exports=Class
