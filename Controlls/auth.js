const user = require("../models/user")
const RefreshToken = require('../models/RefreshToken')
const jwt = require("jsonwebtoken")
const utils = (data) => { 
    return ({
        Username: data.Username,
        Useremail: data.Useremail,
        id: data._id,
        Role: data.Role,
        userImage:data.userImage
    })
}
class AuthControlles {
    // login user`
    async Login(req, res) {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        
        // finding existing user
        const findUser = await user.findOne({ Useremail:email, Password:password });
        // console.log(findUser)
        // console.log(username, email, password)
        if (findUser) {
            const token = await findUser.assigntoken();
            findUser.save()
            res.cookie("User", `${token}`, {
                httpOnly: true,
                expires: new Date(Date.now() + 3600000)//1hour
            })
            const updatedrefreshTokenforuser = await jwt.sign({ _id: findUser._id }, process.env.SecretKeyToken, { expiresIn: "7d" });
            const findRefreshToken=await RefreshToken.findOne({
                userID: findUser._id 
            })
            if(findRefreshToken){
                await RefreshToken.findOneAndUpdate(
                    { userID: findUser._id },
                    { RefreshToken: updatedrefreshTokenforuser },
                    { new: true }
                )
            }else{
                await RefreshToken({
                    userID: findUser._id,
                    RefreshToken: updatedrefreshTokenforuser
                }).save()
            }
        
            return res.status(200).json(utils(findUser))
        }

        if (username === "admin" && email === "admin@gmail.com" && password === "admin") {
            const saveadmin = await user({
                Username: username,
                Useremail: email,
                Password: password,
                Role: "Admin"
            })
            const token = await saveadmin.assigntoken();
            await saveadmin.save()
            // refresh token generate
            const refreshTokenforuser = await jwt.sign({ _id: saveadmin._id }, process.env.SecretKeyToken, { expiresIn: "7d" });
            await RefreshToken({
                userID: saveadmin._id,
                RefreshToken: refreshTokenforuser
            }).save()
            res.cookie("User", `${token}`, {
                httpOnly: true,
                expires: new Date(Date.now() + 3600000)//1hour
            })
            return res.status(200).json(utils(saveadmin))
        }
        return res.status(400).json({message:"Login failed"})
    }


    // refreshTokenRequest
    async RefreshTokenRqst(req, res) { 
        const { User } = req.cookies;
        if (User) {
            const verifyAccessToken = await jwt.verify(User, `${process.env.SecretKeyToken}`)
            const UserID = verifyAccessToken._id
            const verifyRefreshUser = await RefreshToken.findOne({ userID: UserID })
            if (verifyRefreshUser) {
                const NewAccessToken = await jwt.sign({ _id: UserID }, process.env.SecretKeyToken, { expiresIn: "1h" });
                const findUserAndUpdateAccessToken = await user.findByIdAndUpdate(
                    { _id: UserID },
                    { AccessToken: NewAccessToken },
                    { new: true }
                )
                res.cookie("User", `${NewAccessToken}`, {
                    httpOnly: true,
                    expires: new Date(Date.now() + 3600000)//1hour
                })
                return res.status(200).json(utils(findUserAndUpdateAccessToken)) 
            }

        }
    }


    // refreshTokenGenerate
    async RefreshTokenGenerate(req, res) {
        const { User } = req.cookies;
        if (User) {
            const verifyUser = await jwt.verify(User, `${process.env.SecretKeyToken}`)
            const UserID = verifyUser._id
            const verifyRefreshUser = await RefreshToken.findOne({ userID: UserID })
            if (verifyRefreshUser) {
                const newRefreshToken = await jwt.sign({ _id: UserID }, process.env.SecretKeyToken, { expiresIn: "7d" });
                const findUserAndUpdateRefreshToken = await RefreshToken.findOneAndUpdate(
                    { userID: UserID },
                    { RefreshToken: newRefreshToken },
                    { new: true }
                )
                return res.status(200).json(utils(findUserAndUpdateRefreshToken))
            }
        }

    }


    // here logout request 
    async LogoutUser(req,res){
        const {User}=req.cookies;
        if(User){
            const verifyUser = await jwt.verify(User, `${process.env.SecretKeyToken}`)
            const UserID = verifyUser._id
            await user.findOneAndUpdate(
                { _id: UserID },
                { AccessToken: "" },
                { new: true }
            )
            await RefreshToken.findOneAndUpdate(
                { userID: UserID },
                { RefreshToken: "" },
                { new: true }
            )
            res.clearCookie("User")
            res.status(200).json({message:"logout"})
        }
    }
}

module.exports = new AuthControlles();