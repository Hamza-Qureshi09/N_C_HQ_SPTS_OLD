import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  studentRecord:[],
}


export const StudentRecord = createSlice({
  name: 'StudentRecord',
  initialState,
  reducers: {
    StudentRecordInfo: (state,action) => {
        const Record=action.payload
        // console.log(Record);
        if (Record) {
            state.studentRecord=Record
        }
    },
  },
})

// Action creators are generated for each case reducer function
export const { StudentRecordInfo,} = StudentRecord.actions

export default StudentRecord.reducer 