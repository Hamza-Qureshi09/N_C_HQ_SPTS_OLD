const router=require("express").Router();
const AuthControlles=require('../Controlls/auth')
const Management=require("../Controlls/Mangement")
const Events=require("../Controlls/Event")
const Attendence=require("../Controlls/Attendence")
const Appointement=require("../Controlls/Appointements")
const Leaves=require("../Controlls/Leave")
const Fees=require("../Controlls/Fee")
const StudentReport=require("../Controlls/StudentReport")
const Activity=require("../Controlls/Activity")
const userProfile=require("../Controlls/userProfile")
const Feedback=require("../Controlls/Feedback")
const Dashboard=require("../Controlls/Dashboard")
const RefreshToken=require("../models/RefreshToken") 
const user=require("../models/user")
const jwt=require("jsonwebtoken");

// Auth Routes
router.post("/auth/Login",AuthControlles.Login)
router.get("/auth/Login/autoRefreshTokenRqst",AuthControlles.RefreshTokenRqst) 
router.post("/auth/Login/refreshToken",AuthControlles.RefreshTokenGenerate)
router.get("/auth/LogoutUser",AuthControlles.LogoutUser)

// Management Routes

// 1) Class Management 
router.post("/Manage/AddClass",Management.AddClass)
router.get("/Manage/GetClass",Management.GetClass)
router.get("/Manage/GetClass/:id",Management.GetSingleClass)
router.post("/Manage/GetClass/updateClass",Management.UpdateSingleClass)
router.post("/Manage/GetClass/removeClass",Management.RemoveSingelClass)

// 2) Subject Management
router.post("/Manage/AddSubject",Management.AddSubject)
router.get("/Manage/GetSubjects",Management.GetSubjects)
router.get("/Manage/GetSubject/:id",Management.GetSingleSubject)
router.post("/Manage/GetSubject/updateSubject",Management.UpdateSingleSubject)
router.post("/Manage/GetSubject/removeSubject",Management.RemoveSingelSubject)

// 3) Teacher Management
router.post("/Manage/AddTeacher",Management.AddTeacher)
router.get("/Manage/GetTeacher",Management.GetTeachers)
router.get("/Manage/GetTeacher/:id",Management.GetSingleTeacher)
router.post("/Manage/GetTeacher/updateTeacher",Management.UpdateSingleTeacher)
router.post("/Manage/GetTeacher/removeTeacher",Management.RemoveSingelTeacher)

// 4) Student Management
router.post("/Manage/AddStudent",Management.AddStudent)
router.get("/Manage/GetParents",Management.GetParents) 
router.get("/Manage/GetStudent",Management.GetStudent)
router.get("/Manage/GetStudent/:id",Management.GetSingleStudent)
router.post("/Manage/GetStudent/updateStudent",Management.UpdateSingleStudent)
router.post("/Manage/GetStudent/removeStudent",Management.RemoveSingelStudent)


// 5) Event management
router.post("/Manage/AddEvent",Events.AddEvent)
router.get("/Manage/GetEvent",Events.GetEvents)
router.get("/Manage/GetEvent/:id",Events.GetSingleEvent)
router.post("/Manage/GetEvent/updateEvent",Events.UpdateSingleEvent)
router.post("/Manage/GetEvent/removeEvent",Events.RemoveSingelEvent)

// 6) Holidays Management
router.post("/Manage/AddHoliday",Management.AddHoliday)
router.get("/Manage/GetHoliday",Management.GetHolidays)
router.post("/Manage/upldateHoliday",Management.UpdateSingleHoliday)

// 7) Attendence Management
router.post("/auth/userValidation/Attendence",Attendence.validateUser)
router.post("/auth/MarkAttendence",Attendence.MarkAttendence)
router.get("/getStudents",Attendence.GetStudents)
router.get("/getSingleStudentInfo",Attendence.GetSingleStudent)

// 8) Appointement page
router.get("/Manage/getTeachers/",Appointement.GetTeachers)
router.post("/Manage/AppointementAdd",Appointement.NewAppointement)
router.get("/Manage/GetAppointements/",Appointement.GetAppointements)
router.post("/Manage/updateAppointment",Appointement.UpdateAppointement)

// 9) Leave page
router.get("/Manage/getStudents",Leaves.GetStudentsForLeave)
router.post("/Manage/LeaveAdd",Leaves.NewLeave)
router.get("/Manage/GetLeaves",Leaves.GetLeaves)
router.post("/Manage/updateLeave",Leaves.UpdateLeaves)

// 10) Fee challan
router.post("/Manage/AddFee",Fees.AddFee)
router.get("/Manage/getFees",Fees.GetFees)
router.get("/Manage/GetFee/:id",Fees.GetSingleFee)
router.post("/Manage/updateFee",Fees.UpdateFee)
router.post("/Manage/removeFeeChallan",Fees.RemoveSingelFeeChallan)

// 11) Student Report 
router.post("/auth/validateParentSReport",StudentReport.validateUser)

// 12) Exams Management
router.get("/auth/GetAllSubjects/:Class",Management.getSubjects)
router.post("/auth/AddExams",Management.AddExam)
router.get("/auth/GetAllExams",Management.GetAllExams)
router.post("/auth/Result",Management.AddExamOverAllImage)
router.post("/Manage/removeSingleExam",Management.RemoveSingleExam)
router.get("/Manage/GetSingleExam/:id",Management.GetSingleExam)
router.post("/Manage/UpdateSingleExam",Management.UpdateSingleExam)

// 13) Adding ExamResult in student
router.get("/Manage/ExamsSubject",Management.ExamSubjects)
router.post("/Manage/AddExamMarks",Management.AddExamMarks)

// 14) Adding Activity
router.post("/Manage/AddActivity",Activity.AddNewActivity)
router.get("/Manage/GetActivities",Activity.GetActivities)
router.get("/Manage/GetSingleActivity/:id",Activity.GetSingleActivity)
router.post("/Manage/UpdateSingleActivity",Activity.UpdateSingleActivity)
router.post("/Manage/RemoveSingleActivty",Activity.RemoveSingleActivty)

// 15) updating userProfile
router.post("/Profile/UpdateUser",userProfile.updateUserProfile)

// 16) feedback 
router.get("/Manage/FeedbackStudents",Feedback.GetStudentsForFeedback)
router.get("/Manage/FeedbackSubjects",Feedback.GetSubjectsForFeedback)
router.post("/Manage/AddNewFeedback",Feedback.AddNewFeedback)
router.get("/Manage/GetFeedbacks",Feedback.GetFeedbacks)
router.post("/Manage/updateLeave",Leaves.UpdateLeaves)

//  17) Dashboard
router.get("/Get/DashboardInfo",Dashboard.GetInfo)

module.exports=router; 