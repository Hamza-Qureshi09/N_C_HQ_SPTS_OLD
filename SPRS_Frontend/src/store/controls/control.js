import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status:true,
}


export const controls = createSlice({
  name: 'Controls',
  initialState,
  reducers: {
    sideBarToggleFunc: (state,action) => {
        const updateStatus=action.payload
        if (updateStatus) {
            state.status=updateStatus.newStatus
        }
    },


  },
})

// Action creators are generated for each case reducer function
export const { sideBarToggleFunc} = controls.actions

export default controls.reducer 