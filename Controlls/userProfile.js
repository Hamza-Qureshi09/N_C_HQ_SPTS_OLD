const userModel = require("../models/user")
const fs = require("fs")
const path = require('path');
const Jimp = require("jimp");


// image compression and setup
const ImageCompression = async (imageSelct) => {
    const buffer = Buffer.from(imageSelct.replace(/^data:image\/(jpg|jpeg|png);base64,/, ''), 'base64')
    const imageName = `image_${Date.now()}_${Math.round(
        Math.random() * 1e9 //ye million hai
    )}.png`

    const jimpResp = await Jimp.read(buffer);
    jimpResp.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../Storage/Users/${imageName}`))
    return imageName;

}

class UserProfile {
    // updating user profile
    async updateUserProfile(req, res) {
        const {id, username, imageSelct,userImage } = req.body;
        if(id){
            if(userImage){
                fs.unlinkSync(path.join(__dirname, `../Storage/Users/${userImage}`)) //deleting existing image
                const ImageRes = await ImageCompression(imageSelct)
               const updateUser= await userModel.findByIdAndUpdate(
                    {_id:id},
                    {
                        Username:username,
                        userImage:ImageRes
                    },
                    {new:true,upsert:true}
                )
                return res.status(200).json(updateUser)
            }else{
                const ImageRes = await ImageCompression(imageSelct)
               const updateUser= await userModel.findByIdAndUpdate(
                    {_id:id},
                    {
                        Username:username,
                        userImage:ImageRes
                    },
                    {new:true,upsert:true}
                )
                return res.status(200).json(updateUser)
            }
            
        }
        return res.status(400).json({message:"invalid information"})
       
    }

}
module.exports = new UserProfile()