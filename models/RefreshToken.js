const mongoose=require("mongoose")

const refreshTokenSchema=new mongoose.Schema({
    userID:{type:String,required:true},
    RefreshToken: {
        type: String, 
    }
},{timestamps:true})



const refreshToken=new mongoose.model("refreshToken",refreshTokenSchema);  

module.exports=refreshToken
