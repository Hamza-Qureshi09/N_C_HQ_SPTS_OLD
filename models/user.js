const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")

const userSchema=new mongoose.Schema({
    Username:{type:String,required:true},
    Useremail:{type:String,required:true},
    Password:{type:String,required:true},
    Role:{type:String,required:false}, 
    AccessToken: {
        type: String, 
    },
    userImage:{type:String,required:false,default:""}
},{timestamps:true})


userSchema.methods.assigntoken=async function(){
    const token = await jwt.sign({ _id: this._id }, process.env.SecretKeyToken,{expiresIn:"1h"});
        this.AccessToken =token;
        return token;
    // next()
}
const user=new mongoose.model("user",userSchema);  

module.exports=user
