import { createSlice } from '@reduxjs/toolkit'

const initialState = { 
  username:"",
  useremail:"",
  id:"",
  role:"",
  userImage:""
}


export const userAuth = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    validateAndCheckUser: (state,action) => {
        const user=action.payload
        if (user) {
            state.id=user.id
            state.role=user.Role
            state.username=user.Username
            state.useremail=user.Useremail
            state.userImage=user.userImage
        }
    }
  },
})

// Action creators are generated for each case reducer function
export const { validateAndCheckUser} = userAuth.actions

export default userAuth.reducer 