import React, { useState } from 'react'
import style from './Profile.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { validateAndCheckUser } from '../../store/auth/user';

const Profile = () => {
    const {id,username,userImage,role}= useSelector((state) => { return state.userAuth })
    const [imageSelct, setimageSelct] = useState(`/Storage/Users/${userImage}`)
    const [inputVal, setinputVal] = useState({
        Username: `${username}`
    })
    const dispatch = useDispatch()
    const navigate=useNavigate()

    const handlingImages = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setimageSelct(reader.result)
        }
    }

    const SubmitData = async () => {
        // 
        if(!inputVal.Username || !imageSelct){
            return window.alert("fill all the fields first!")
        }
        const responce=await axios.post("/api/Profile/UpdateUser",
        {username:inputVal.Username,imageSelct,id,userImage},
        { headers:{
            "Content-Type":"application/json",      
            Accept:"application/json"   
        },
        withCredentials:true})
        if(responce.status===200){
            dispatch(validateAndCheckUser(responce.data))
            return window.alert("successfully updated!");
        }else{
            return window.alert("error in update kindly try again!");
        }

    }
    return (
        <div className={style.ProfilePage}>
            <div className={style.goBackButton} onClick={() => { return navigate(`/${role}/Dashboard`) }}>
                <button>
                    {/* <img src="/images/goback.png" alt="" /> */}
                    Go Back</button>
            </div>
            <div className={style.prfileCard}>
                {/* id={`${isRole === 'User' ? 'forUserExtraField' : ''}`} */}
                <div className={style.ProfileCardLeft}>
                    <div className={style.forProfileImage}>
                        <p>Choose an awesome image 🚀</p>
                        <div className={style.ImageProfile}>
                            <img src={imageSelct ? imageSelct : userImage} alt="not found" />
                        </div>
                        <label htmlFor="profileImage">Choose an image</label>
                        <input type="file" name="UGForm_image" accept="image/png, image/jpg, image/jpeg" id="profileImage" onChange={handlingImages} hidden />
                    </div>
                    <div className={style.forProfileUsername}>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="Username" id="username" onChange={(e) => { setinputVal({ Username: e.target.value }) }} placeholder="Username..." value={inputVal.Username} />
                    </div>
                    <button onClick={SubmitData}>Set Profile</button>
                </div>
                <div className={style.ProfileCardRightForPreview}>
                    <div className={style.rightsidepreview}>
                        <h3>Preview Image</h3>
                        <div className={style.ProfileImage}>
                            {imageSelct ? <img src={imageSelct} alt="" /> : ""}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile