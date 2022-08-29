import { configureStore } from '@reduxjs/toolkit'
import controls from './controls/control'
import attendenceRecord from './attendenceRecord/attendenceRecord'
import studentRecord from './StudentReport/StudentReport'
import userAuth from './auth/user'


export const store = configureStore({
    reducer: {
        userAuth,
        controls,
        attendenceRecord,
        studentRecord
    },
  })