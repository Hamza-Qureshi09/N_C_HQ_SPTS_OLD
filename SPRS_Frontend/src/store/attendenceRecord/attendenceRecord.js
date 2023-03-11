import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  students:[],
  markedStudentsArr:[]
}


export const attendenceRecord = createSlice({
  name: 'attendenceRecord',
  initialState,
  reducers: {
    StudentsAttendence: (state,action) => {
        const Record=action.payload
        // console.log(Record);
        if (Record) {
            state.students=Record
        }
    },
    MarkedStudents: (state,action) => {
        const Record=action.payload
        // console.log(Record);
        if (Record) {
            state.markedStudentsArr=Record
        }
    }
  },
})

// Action creators are generated for each case reducer function
export const { StudentsAttendence,MarkedStudents} = attendenceRecord.actions

export default attendenceRecord.reducer 