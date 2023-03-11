const user = require("../models/user")
const RefreshToken = require('../models/RefreshToken')
const jwt = require("jsonwebtoken")
<<<<<<< HEAD
const utils = (data) => {
=======
const utils = (data) => { 
>>>>>>> origin/master
    return ({
        Username: data.Username,
        Useremail: data.Useremail,
        id: data._id,
        Role: data.Role,
<<<<<<< HEAD
        userImage: data.userImage
=======
        userImage:data.userImage
>>>>>>> origin/master
    })
}
class AuthControlles {
    // login user`
    async Login(req, res) {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
<<<<<<< HEAD

        // finding existing user
        const findUser = await user.findOne({ Useremail: email, Password: password });
=======
        
        // finding existing user
        const findUser = await user.findOne({ Useremail:email, Password:password });
>>>>>>> origin/master
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
<<<<<<< HEAD
            const findRefreshToken = await RefreshToken.findOne({
                userID: findUser._id
            })
            if (findRefreshToken) {
=======
            const findRefreshToken=await RefreshToken.findOne({
                userID: findUser._id 
            })
            if(findRefreshToken){
>>>>>>> origin/master
                await RefreshToken.findOneAndUpdate(
                    { userID: findUser._id },
                    { RefreshToken: updatedrefreshTokenforuser },
                    { new: true }
                )
<<<<<<< HEAD
            } else {
=======
            }else{
>>>>>>> origin/master
                await RefreshToken({
                    userID: findUser._id,
                    RefreshToken: updatedrefreshTokenforuser
                }).save()
            }
<<<<<<< HEAD

=======
        
>>>>>>> origin/master
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
<<<<<<< HEAD
        return res.status(400).json({ message: "Login failed" })
=======
        return res.status(400).json({message:"Login failed"})
>>>>>>> origin/master
    }


    // refreshTokenRequest
<<<<<<< HEAD
    async RefreshTokenRqst(req, res) {
=======
    async RefreshTokenRqst(req, res) { 
>>>>>>> origin/master
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
<<<<<<< HEAD
                return res.status(200).json(utils(findUserAndUpdateAccessToken))
            }

        }
        else {
            res.status(401).json({ message: "unauthorized user!" })
        }
=======
                return res.status(200).json(utils(findUserAndUpdateAccessToken)) 
            }

        }
>>>>>>> origin/master
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
<<<<<<< HEAD
    async LogoutUser(req, res) {
        const { User } = req.cookies;
        if (User) {
=======
    async LogoutUser(req,res){
        const {User}=req.cookies;
        if(User){
>>>>>>> origin/master
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
<<<<<<< HEAD
            res.status(200).json({ message: "logout" })
=======
            res.status(200).json({message:"logout"})
>>>>>>> origin/master
        }
    }
}

module.exports = new AuthControlles();