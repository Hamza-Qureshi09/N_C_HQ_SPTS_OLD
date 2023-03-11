const classModel = require("../models/Class")
const subjectModel = require("../models/Subjects")
const TeacherModel = require("../models/Teacher")
const userModel = require("../models/user")
const studentModel = require("../models/Student")
const parentModel = require("../models/Parents")
const holidayModel = require("../models/Holiday")
const examModel = require("../models/Exams")
const fs = require("fs")
const path = require('path');
const Jimp = require("jimp");

const utils = (data) => {
    return data.map((val, index, arr) => {
        return (
            {
                id: val._id,
                className: val.Cname ? val.Cname : "",
                Fee: val.Cfee ? val.Cfee : "",
                SubjectClass: val.SubjClass ? val.SubjClass : "",
                Subjectname: val.Subjectname ? val.Subjectname : "",
                createdAt: val.createdAt ? val.createdAt : "",
                DateTime: val.Time ? val.Time : "",
                Teachername: val.Tname ? val.Tname : "",
                TeacherAddress: val.Taddress ? val.Taddress : "",
                Classes: val.Tclasses ? val.Tclasses : "",
                TeacherBirthdate: val.Tbirthdate ? val.Tbirthdate : "",
                TeacherPhone: val.Tphone ? val.Tphone : "",
                Education: val.Teducation ? val.Teducation : "",
                Gender: val.Tgender ? val.Tgender : "",
                martialStatus: val.Tmartialstatus ? val.Tmartialstatus : "",
                TeacherEmail: val.Temail ? val.Temail : "",
                SetTeacherPassword: val.Tpassword ? val.Tpassword : "",
                Salary: val.Tsalary ? val.Tsalary : "",
                Remarks: val.Tremarks ? val.Tremarks : "",
                TeacherImage: val.Tpicture ? val.Tpicture : "",
            }
        )
    })
}
const Singleutils = (data) => {
    return ({
        id: data._id,
        className: data.Cname ? data.Cname : "",
        Fee: data.Cfee ? data.Cfee : "",
        SubjectClass: data.SubjClass ? data.SubjClass : "",
        Subjectname: data.Subjectname ? data.Subjectname : "",
        DateTime: data.Time ? data.Time : "",
        Teachername: data.Tname ? data.Tname : "",
        TeacherAddress: data.Taddress ? data.Taddress : "",
        Classes: data.Tclasses ? data.Tclasses : "",
        TeacherBirthdate: data.Tbirthdate ? data.Tbirthdate : "",
        TeacherPhone: data.Tphone ? data.Tphone : "",
        Education: data.Teducation ? data.Teducation : "",
        Gender: data.Tgender ? data.Tgender : "",
        martialStatus: data.Tmartialstatus ? data.Tmartialstatus : "",
        TeacherEmail: data.Temail ? data.Temail : "",
        SetTeacherPassword: data.Tpassword ? data.Tpassword : "",
        Salary: data.Tsalary ? data.Tsalary : "",
        Remarks: data.Tremarks ? data.Tremarks : "",
        TeacherImage: data.Tpicture ? data.Tpicture : "",
    })
}


// image compression and setup
const ImageCompression = async (imageSelct, user) => {
    // image setup compression
    const buffer = Buffer.from(imageSelct.replace(/^data:image\/(jpg|jpeg|png);base64,/, ''), 'base64')
    const imageName = `image_${Date.now()}_${Math.round(
        Math.random() * 1e9 //ye million hai
    )}.png`

    const jimpResp = await Jimp.read(buffer);
    if (user === "Teacher") {
        jimpResp.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../Storage/Teachers/${imageName}`))
        return imageName;
    } else if (user === "Student") {
        jimpResp.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../Storage/Students/${imageName}`))
        return imageName;
    } else if (user === "Exams") {
        jimpResp.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../Storage/Exams/${imageName}`))
        return imageName;
    }

}


// var populateQuery = [{path:'books', select:'title pages'}, {path:'movie', select:'director'}];

// Person.find({})
//  .populate(populateQuery)
//  .execPopulate()

class Management {
    // Class Add and manage
    async AddClass(req, res) {
        try {
            const { className, Fee } = req.body;
            if (!className || !Fee) {
                return res.status(400).json("Incomplete Details!")
            }
            const addclass = await classModel({
                Cname: className,
                Cfee: Fee
            }).save();
            return res.status(200).json({ message: "successfully created!" })
        } catch (error) {
            console.log(error);
        }
    }


    // get all classes
    async GetClass(req, res) {
        try {
            const query = req.query
            // working on query for filter results
            if (query.q || query._start || query._end || query._sort || query._order) {
                let sortingMethod = query._sort;
                const classes = await classModel.find(query.q && { Cname: query.q }).skip(query._start).limit(query._end - query._start).sort(sortingMethod === "Cfee" ? { Cfee: 1 } : sortingMethod === "Cname" ? { Cname: 1 } : { _id: 1 });
                return res.status(200).json(utils(classes))
            }
            const classes = await classModel.find({});// getting all classses
            return res.status(200).json(utils(classes))
        } catch (error) {
            console.log(error);
            return res.status(400).json("error occured")
        }
    }


    // get single class for update
    async GetSingleClass(req, res) {
        let params = req.params.id;
        const findSingleClass = await classModel.findOne({ _id: params });
        res.status(200).json(Singleutils(findSingleClass))
    }


    // updating single classs
    async UpdateSingleClass(req, res) {
        const { Id, className, Fee } = req.body;
        const findClassandUpdate = await classModel.findByIdAndUpdate(
            { _id: Id },
            {
                Cname: className,
                Cfee: Fee
            },
            { new: true, upsert: true }
        )
        res.status(200).json(Singleutils(findClassandUpdate))
    }


    // deleteing single Class
    async RemoveSingelClass(req, res) {
        const { Id } = req.body;
        console.log(Id)
        const deleterecord = await classModel.findByIdAndDelete(
            { _id: Id }
        )
        if (deleterecord) {
            return res.status(200).json("Row Deleted!")
        }
        return res.status(400).json("Row Deleted!")
    }




    // Subject Add and also add to class Model for refrence and Mange
    async AddSubject(req, res) {
        const { subjectName, Class, Time } = req.body;
        if (!subjectName || !Class || !Time) {
            return res.status(400).json("Incomplete Details!")
        }
        try {
            const newSubject = await subjectModel({
                Subjectname: subjectName,
                SubjClass: Class,
                Time
            }).save()
            // console.log(newSubject._id)
            const updateClassModel = await classModel.findOneAndUpdate(
                { Cname: Class },
                { $addToSet: { Csubjects: newSubject._id } },
                { new: true, upsert: true }
            )
            console.log(updateClassModel)
            return res.status(200).json({ message: "successfully created!" })
        } catch (error) {
            console.log(error);
        }
    }


    // get all Subjects
    async GetSubjects(req, res) {
        try {
            const query = req.query
            // working on query for filter results
            if (query.q || query._start || query._end || query._sort || query._order) {
                let sortingMethod = query._sort;
                const subjects = await subjectModel.find(query.q && { Subjectname: query.q }).skip(query._start).limit(query._end - query._start).sort(sortingMethod === "Subjectname" ? { Subjectname: 1 } : sortingMethod === "SubjectClass" ? { SubjClass: 1 } : { _id: 1 });
                return res.status(200).json(utils(subjects))
            }
            const subjects = await subjectModel.find({});// getting all subjects
            return res.status(200).json(utils(subjects))
        } catch (error) {
            console.log(error);
        }
    }


    // get single class for update
    async GetSingleSubject(req, res) {
        let params = req.params.id;
        console.log(params)
        const findSingleSubject = await subjectModel.findOne({ _id: params });
        res.status(200).json(Singleutils(findSingleSubject))
    }


    // updating single classs
    async UpdateSingleSubject(req, res) {
        const { subjectName, Class, Id, Time } = req.body;
        const findSubjectandUpdate = await subjectModel.findByIdAndUpdate(
            { _id: Id },
            {
                Subjectname: subjectName,
                SubjClass: Class,
                Time
            },
            { new: true, upsert: true }
        )
        res.status(200).json(Singleutils(findSubjectandUpdate))
    }


    // deleteing single Class
    async RemoveSingelSubject(req, res) {
        const { Id } = req.body;
        await subjectModel.findByIdAndDelete(
            { _id: Id }
        )
        const classRecordDlt = await classModel.findOneAndUpdate(
            { Csubjects: Id },
            {
                $pull: {
                    Csubjects: Id
                }
            },
            { new: true, upsert: true }
        )
        res.status(200).json("Row Deleted!")
    }





    // Teacher add and also add to class model for refrence and manage
    async AddTeacher(req, res) {
        const { Teachername, TeacherAddress, TeacherBirthdate, TeacherPhone, Education, Gender, martialStatus, TeacherEmail, SetTeacherPassword, Salary, Remarks, TeacherImage } = req.body;
        if (!Teachername || !TeacherAddress || !TeacherBirthdate || !TeacherPhone || !Education || !Gender || !martialStatus || !TeacherEmail || !SetTeacherPassword || !Salary) {
            return res.status(400).json("Incomplete Details!")
        }
        let ImageRes;
        if (TeacherImage) {
            // image compression and saving to specific folder
            ImageRes = await ImageCompression(TeacherImage, "Teacher")
        }
        try {
            const newTeacher = await TeacherModel({
                Tname: Teachername, Taddress: TeacherAddress, Tbirthdate: TeacherBirthdate, Tphone: TeacherPhone, Teducation: Education, Tgender: Gender, Tmartialstatus: martialStatus, Temail: TeacherEmail, Tpassword: SetTeacherPassword, Tsalary: Salary, Tremarks: Remarks, Tpicture: ImageRes ? ImageRes : ""
            }).save()
            // console.log(newTeacher)
            await userModel({
                _id: newTeacher._id, //assigning same id of created teacher
                Username: newTeacher.Tname,
                Useremail: newTeacher.Temail,
                Password: newTeacher.Tpassword,
                Role: "Teacher"
            }).save()
            // console.log(newUserAsTeacher)
            return res.status(200).json({ message: "successfully created!" })
        } catch (error) {
            console.log(error);
        }
    }


    // get all Teachers
    async GetTeachers(req, res) {
        try {
            const query = req.query
            // working on query for filter results
            if (query.q || query._start || query._end || query._sort || query._order) {
                let sortingMethod = query._sort;
                const Teachers = await TeacherModel.find(query.q && { Tname: query.q }).skip(query._start).limit(query._end - query._start).sort(sortingMethod === "Teachername" ? { Tname: 1 } : sortingMethod === "Salary" ? { Tsalary: 1 } : { _id: 1 });
                return res.status(200).json(utils(Teachers))
                // console.log(Teachers)
            }
            const Teachers = await TeacherModel.find({}).populate('Tclasses');// getting all subjects
            // console.log(Teachers)
            return res.status(200).json(utils(Teachers))
            // console.log(Teachers)
        } catch (error) {
            console.log(error);
        }
    }


    // Get single teacher for updation
    async GetSingleTeacher(req, res) {
        let params = req.params.id;
        console.log(params)
        const findSingleSubject = await TeacherModel.findOne({ _id: params });
        res.status(200).json(Singleutils(findSingleSubject))
    }


    // updating single classs
    async UpdateSingleTeacher(req, res) {
        const { Id, Teachername, TeacherAddress, Class, TeacherBirthdate, TeacherPhone, Education, Gender, martialStatus, TeacherEmail, SetTeacherPassword, Salary, Remarks, TeacherImage, imageSelct } = req.body;

        const findTeacherandUpdate = await TeacherModel.findByIdAndUpdate(
            { _id: Id },
            {
                Tname: Teachername,
                Taddress: TeacherAddress,
                Tbirthdate: TeacherBirthdate,
                Tphone: TeacherPhone,
                Teducation: Education,
                Tgender: Gender,
                Tmartialstatus: martialStatus,
                Temail: TeacherEmail,
                Tpassword: SetTeacherPassword,
                Tsalary: Salary,
                Tremarks: Remarks,
            },
            { new: true, upsert: true }
        )

        if (Class) {
            const updateClassModel = await classModel.findOneAndUpdate(
                { Cname: Class },
                { $addToSet: { Cteacher: findTeacherandUpdate._id } },
                { new: true, upsert: true }
            )
            const updateTeachermodelwithclassId = await TeacherModel.findByIdAndUpdate(
                { _id: Id },
                {
                    $addToSet: { Tclasses: updateClassModel.Cname },
                },
                { new: true, upsert: true }
            )
        }

        if (TeacherImage !== null) {
            if (imageSelct !== null) {
                fs.unlinkSync(path.join(__dirname, `../Storage/Teachers/${TeacherImage}`)) //deleting existing image
                const ImageRes = await ImageCompression(imageSelct, "Teacher") // image compression and creating new image and saving to user record
                await TeacherModel.findByIdAndUpdate(
                    { _id: findTeacherandUpdate._id },
                    { Tpicture: ImageRes },
                    { new: true, upsert: true }
                )
                return res.status(200).json("image updated successfully!")
            } else {
                return res.status(200).json("updated successfully! 1")
            }
        } else {
            if (imageSelct !== null) {
                const ImageRes = await ImageCompression(imageSelct, "Teacher") // image compression and creating new image and saving to user record
                await TeacherModel.findByIdAndUpdate(
                    { _id: findTeacherandUpdate._id },
                    { Tpicture: ImageRes },
                    { new: true, upsert: true }
                )
                return res.status(200).json("image updated successfully!")
            } else {
                return res.status(200).json("updated successfully! 2")
            }
        }
        // res.status(200).json(Singleutils(updateTeachermodelwithclassId))

    }


    // deleteing single Class
    async RemoveSingelTeacher(req, res) {
        const { Id, Classes, Image } = req.body;
        if (Classes) {
            await classModel.findOneAndUpdate(
                { Cteacher: Id },
                {
                    $pull: {
                        Cteacher: Id
                    }
                },
                { new: true, upsert: true }
            )
        }
        if (Image) {
            fs.unlinkSync(path.join(__dirname, `../Storage/Teachers/${Image}`)) //deleting existing image
        }
        await TeacherModel.findByIdAndDelete(
            { _id: Id }
        )
        await userModel.findByIdAndDelete(
            { _id: Id }
        )
        res.status(200).json("Row Deleted!")
    }





    // student add and also add to parent model for refrence and manage
    async AddStudent(req, res) {
        const { StudentName, StudentRollno, StudentAddress, StudnetBirthdate, StudnetPhone, Gender, ParentStatus, ParentName, ParentEmail, SetParentPassword, ParentAlreadyExistName, Class, FeeStatus, Amount, StudentImage } = req.body;
        if (!StudentName || !StudentRollno || !StudentAddress || !StudnetBirthdate || !Gender || !ParentStatus || !Class || !FeeStatus) {
            return res.status(400).json("Incomplete Details!")
        }
        let ImageRes;
        if (StudentImage) {
            // image compression and saving to specific folder
            ImageRes = await ImageCompression(StudentImage, "Student")
        }
        try {
            const newStudent = await studentModel({
                Sname: StudentName, Saddress: StudentAddress, Srollno: StudentRollno, Sbirthdate: StudnetBirthdate, Sphone: StudnetPhone, Sgender: Gender, SparentDetails: ParentName ? ` ${ParentName} \n ${ParentEmail} \n ${SetParentPassword}` : ParentAlreadyExistName, Sclass: Class, Sfeestatus: FeeStatus, Sfeeamount: Amount ? Amount : 0, Spicture: ImageRes ? ImageRes : ""
            }).save()

            await classModel.findOneAndUpdate(
                { Cname: Class },
                { $addToSet: { Cstudents: newStudent._id } },
                { new: true, upsert: true }
            )
            if (ParentStatus === "parentexist") {
                await parentModel.findOneAndUpdate(
                    { Pname: ParentAlreadyExistName },
                    { $addToSet: { childs: newStudent._id } },
                    { new: true, upsert: true }
                )
            }

            if (ParentStatus === "newparent") {

                const newParent = await parentModel({
                    Pname: ParentName ? ParentName : "not found",
                    Pemail: ParentEmail ? ParentEmail : "not assign",
                    Ppassword: SetParentPassword ? SetParentPassword : "not assign",
                    childs: newStudent._id
                }).save()
                await userModel({
                    _id: newParent._id, //assigning same id of created teacher
                    Username: newParent.Pname,
                    Useremail: newParent.Pemail,
                    Password: newParent.Ppassword,
                    Role: "Parent"
                }).save()
                return res.status(200).json({ message: "successfully created!" })
            }
            return res.status(200).json({ message: "successfully created!" })

        } catch (error) {
            console.log(error);
        }
    }


    // get parents
    async GetParents(req, res) {
        const Parents = await parentModel.find({});
        return res.status(200).json(Parents)
    }


    // get all Students
    async GetStudent(req, res) {
        try {
            const query = req.query
            // working on query for filter results
            if (query.q || query._start || query._end || query._sort || query._order) {
                let sortingMethod = query._sort;
                const Students = await studentModel.find(query.q && { Sname: query.q }).skip(query._start).limit(query._end - query._start).sort(sortingMethod === "StudentName" ? { Sname: 1 } : sortingMethod === "StudentFee" ? { Sfeeamount: 1 } : { _id: 1 });
                return res.status(200).json(Students.map((val) => {
                    return (
                        {
                            id: val._id,
                            StudentName: val.Sname ? val.Sname : "",
                            StudentRollno: val.Srollno ? val.Srollno : "",
                            StudentBirthdate: val.Sbirthdate ? val.Sbirthdate : "",
                            Gender: val.Sgender ? val.Sgender : "",
                            StudentPhone: val.Sphone ? val.Sphone : "",
                            StudentAddress: val.Saddress ? val.Saddress : "",
                            ParentName: val.SparentDetails ? val.SparentDetails[0] : "",
                            Classes: val.Sclass ? val.Sclass : "",
                            Fee: val.Sfeestatus ? val.Sfeestatus : "",
                            Amount: val.Sfeeamount ? val.Sfeeamount : "",
                            StudentPicture: val.Spicture ? val.Spicture : "",
                            StudentMarks: val.Smarks ? val.Smarks : ""
                        }
                    )
                }))
                // console.log(Students)
            }
            const Students = await studentModel.find({})
            // console.log(Students)
            return res.status(200).json(Students.map((val) => {
                return (
                    {
                        id: val._id,
                        StudentName: val.Sname ? val.Sname : "",
                        StudentRollno: val.Srollno ? val.Srollno : "",
                        StudentBirthdate: val.Sbirthdate ? val.Sbirthdate : "",
                        Gender: val.Sgender ? val.Sgender : "",
                        StudentPhone: val.Sphone ? val.Sphone : "",
                        StudentAddress: val.Saddress ? val.Saddress : "",
                        ParentName: val.SparentDetails ? val.SparentDetails[0] : "",
                        Classes: val.Sclass ? val.Sclass : "",
                        Fee: val.Sfeestatus ? val.Sfeestatus : "",
                        Amount: val.Sfeeamount ? val.Sfeeamount : "",
                        StudentPicture: val.Spicture ? val.Spicture : "",
                        StudentMarks: val.Smarks ? val.Smarks : ""
                    }
                )
            }))
            // console.log(Teachers)
        } catch (error) {
            console.log(error);
        }
    }


    // Get single teacher for updation
    async GetSingleStudent(req, res) {
        let params = req.params.id;
        console.log(params)
        const findSingleStudent = await studentModel.findOne({ _id: params });
        res.status(200).json({
            id: findSingleStudent._id,
            StudentName: findSingleStudent.Sname ? findSingleStudent.Sname : "",
            StudentRollno: findSingleStudent.Srollno ? findSingleStudent.Srollno : "",
            StudentBirthdate: findSingleStudent.Sbirthdate ? findSingleStudent.Sbirthdate : "",
            Gender: findSingleStudent.Sgender ? findSingleStudent.Sgender : "",
            StudentPhone: findSingleStudent.Sphone ? findSingleStudent.Sphone : "",
            StudentAddress: findSingleStudent.Saddress ? findSingleStudent.Saddress : "",
            ParentDetails: findSingleStudent.SparentDetails ? findSingleStudent.SparentDetails[0] : "",
            Classes: findSingleStudent.Sclass ? findSingleStudent.Sclass : "",
            Fee: findSingleStudent.Sfeestatus ? findSingleStudent.Sfeestatus : "",
            Amount: findSingleStudent.Sfeeamount ? findSingleStudent.Sfeeamount : "",
            StudentPicture: findSingleStudent.Spicture ? findSingleStudent.Spicture : "",
        })
    }


    // updating single classs
    async UpdateSingleStudent(req, res) {
        const { Id, StudentName, StudentRollno, StudentAddress, StudnetBirthdate, StudnetPhone, Gender, ParentDetails, Class, FeeStatus, Amount, StudentPicture, imageSelct } = req.body;
        //    console.log(Id)
        const findStudentandUpdate = await studentModel.findByIdAndUpdate(
            { _id: Id },
            {
                Sname: StudentName,
                Saddress: StudentAddress,
                Srollno: StudentRollno,
                Sbirthdate: StudnetBirthdate,
                Sphone: StudnetPhone,
                Sgender: Gender,
                $addToSet: { SparentDetails: ParentDetails },
                $addToSet: { Sclass: Class && Class },
                Sfeestatus: FeeStatus,
                Sfeeamount: Amount,
            },
            { new: true, upsert: true }
        )

        if (StudentPicture !== null) {
            if (imageSelct !== null) {
                fs.unlinkSync(path.join(__dirname, `../Storage/Students/${StudentPicture}`)) //deleting existing image
                const ImageRes = await ImageCompression(imageSelct, "Student") // image compression and creating new image and saving to user record
                await studentModel.findByIdAndUpdate(
                    { _id: findStudentandUpdate._id },
                    { Spicture: ImageRes },
                    { new: true, upsert: true }
                )
                return res.status(200).json("image updated successfully!")
            } else {
                return res.status(200).json("updated successfully! 1")
            }
        } else {
            if (imageSelct !== null) {
                const ImageRes = await ImageCompression(imageSelct, "Student") // image compression and creating new image and saving to user record
                await studentModel.findByIdAndUpdate(
                    { _id: findStudentandUpdate._id },
                    { Spicture: ImageRes },
                    { new: true, upsert: true }
                )
                return res.status(200).json("image updated successfully!")
            } else {
                return res.status(200).json("updated successfully! 2")
            }
        }

    }


    // deleteing single Class
    async RemoveSingelStudent(req, res) {
        const { Id, ParentInfo, Image } = req.body;
        console.log(Id)
        // remove from parent table
        if (ParentInfo) {
            await parentModel.findOneAndUpdate(
                { childs: Id },
                {
                    $pull: {
                        childs: Id
                    }
                },
                { new: true, upsert: true }
            )
        }
        // remove from class model
        await classModel.findOneAndUpdate(
            { Cstudents: Id },
            {
                $pull: {
                    Cstudents: Id
                }
            },
            { new: true, upsert: true }
        )
        // remove from student table
        await studentModel.findByIdAndDelete(
            { _id: Id }
        )
        if (Image) {
            fs.unlinkSync(path.join(__dirname, `../Storage/Students/${Image}`)) //deleting existing image
        }
        res.status(200).json("Row Deleted!")
    }






    // holidays management
    async AddHoliday(req, res) {
        const { title, startDate, endDate } = req.body
        if (!title || !startDate || !endDate) {
            return res.status(400).json("Incomplete Details!")
        }
        const newHoliday = await holidayModel({
            Title: title,
            StartDate: startDate,
            EndDate: endDate
        }).save();
        if (newHoliday) {
            return res.status(200).json({
                Title: newHoliday.title,
                StartDate: newHoliday.startDate,
                EndDate: newHoliday.endDate
            })
        }
        return res.status(400).json("not saved!")
    }


    // Get holidays
    async GetHolidays(req, res) {
        const holidays = await holidayModel.find({});
        return res.status(200).json(holidays.map((val, index, arr) => {
            return (
                {
                    id: val._id,
                    title: val.Title ? val.Title : "",
                    startDate: val.StartDate ? val.StartDate : "",
                    endDate: val.EndDate ? val.EndDate : "",
                    allDay: val.allDay ? val.allDay : ""
                }
            )
        }))
    }


    // single holiday update
    async UpdateSingleHoliday(req, res) {
        const { Id, title, startDate, endDate } = req.body
        if (!title || !startDate || !endDate || !Id) {
            return res.status(400).json("Incomplete Details!")
        }
        await holidayModel.findByIdAndUpdate(
            { _id: Id },
            {
                Title: title,
                StartDate: startDate,
                EndDate: endDate
            },
            { new: true, upsert: true }
        )
        return res.status(200).json("update successfully!")
    }








    // Exams Management
    async getSubjects(req, res) {
        const Class = req.params.Class;
        if (!Class) {
            return res.status(400).json("invalid information")
        }
        const GetAllSubjects = await subjectModel.find({
            SubjClass: Class
        });
        res.status(200).json(GetAllSubjects.map((val, index) => {
            return ({
                Subjectname: val.Subjectname
            })
        }))
    }


    // adding new exam and modify class
    async AddExam(req, res) {
        const { Class, ExamsTitle, ExamsDate, ExamsDescription, ExamsOverallMarks, Subject } = req.body;
        if (!Class || !ExamsTitle || !ExamsDate || !ExamsDescription || !ExamsOverallMarks || !Subject) {
            return res.status(400).json("invalid information")
        }
        const AddNewExam = await examModel({
            Title: ExamsTitle,
            Class,
            Subject,
            Date: ExamsDate,
            Description: ExamsDescription,
            TotalMarks: ExamsOverallMarks
        }).save();
        if (AddNewExam) {
            await classModel.findOneAndUpdate(
                { Cname: Class },
                { $addToSet: { Cexam: AddNewExam._id } },
                { new: true, upsert: true }
            )
            return res.status(200).json("New Exam Added Successfully!")
        }
        return res.status(400).json("Error in Adding New Exam!")
    }


    // getting all exams
    async GetAllExams(req, res) {
        const query = req.query
        console.log(query)
        // working on query for filter results
        if (query.q || query._start || query._end || query._sort || query._order) {
            let sortingMethod = query._sort;
            const Exams = await examModel.find(query.q && { Title: query.q }).skip(query._start).limit(query._end - query._start).sort(sortingMethod === "Title" ? { Title: 1 } : { _id: 1 });
            return res.status(200).json(Exams.map((val) => {
                return (
                    {
                        id: val._id,
                        Title: val.Title ? val.Title : "",
                        Class: val.Class ? val.Class : "",
                        Subject: val.Subject ? val.Subject : "",
                        Date: val.Date ? val.Date : "",
                        TotalMarks: val.TotalMarks ? val.TotalMarks : "",
                        FullClassResultPic: val.FullClassResultPic ? val.FullClassResultPic : ""
                    }
                )
            }))
            // console.log(Exams)
        }
        const Exams = await examModel.find({})
        // console.log(Exams)
        return res.status(200).json(Exams.map((val) => {
            return (
                {
                    id: val._id,
                    Title: val.Title ? val.Title : "",
                    Class: val.Class ? val.Class : "",
                    Subject: val.Subject ? val.Subject : "",
                    Date: val.Date ? val.Date : "",
                    TotalMarks: val.TotalMarks ? val.TotalMarks : "",
                    FullClassResultPic: val.FullClassResultPic ? val.FullClassResultPic : ""
                }
            )
        }))
        // console.log(Teachers)

    }


    // adding exam over image and modify exam document
    async AddExamOverAllImage(req, res) {
        const { imageSelct, Id } = req.body;
        console.log(Id)
        if (!imageSelct || !Id) {
            return res.status(400).json("invalid information")
        }
        const findExistingImg = await examModel.findOne({ _id: Id });
        if (findExistingImg.FullClassResultPic) {
            fs.unlinkSync(path.join(__dirname, `../Storage/Exams/${findExistingImg.FullClassResultPic}`)) //remove existing image
            const ImageRes = await ImageCompression(imageSelct, "Exams")
            const modifyExamDoc = await examModel.findByIdAndUpdate(
                { _id: findExistingImg._id },
                { FullClassResultPic: ImageRes },
                { new: true, upsert: true }
            )
            console.log(modifyExamDoc)
            return res.status(200).json("Updated successfully!")
        } else {
            const ImageRes = await ImageCompression(imageSelct, "Exams")
            const modifyExamDoc = await examModel.findByIdAndUpdate(
                { _id: findExistingImg._id },
                { FullClassResultPic: ImageRes },
                { new: true, upsert: true }
            )
            console.log(modifyExamDoc)
            return res.status(200).json("Updated successfully!")
        }
    }


    // delete exam
    async RemoveSingleExam(req, res) {
        const { Id, Image, Class } = req.body;
        console.log(Id)
        // remove from class model
        await classModel.findOneAndUpdate(
            { Cname: Class },
            {
                $pull: {
                    Cexam: Id
                }
            },
            { new: true, upsert: true }
        )
        // remove from student table
        await examModel.findByIdAndDelete(
            { _id: Id }
        )
        if (Image) {
            fs.unlinkSync(path.join(__dirname, `../Storage/Exams/${Image}`))
        }
        res.status(200).json("Row Deleted!")
    }


    // getting single exam
    async GetSingleExam(req, res) {
        let params = req.params.id;
        const findSingleExam = await examModel.findOne({ _id: params });
        res.status(200).json({
            id: findSingleExam._id,
            Title: findSingleExam.Title ? findSingleExam.Title : "",
            Class: findSingleExam.Class ? findSingleExam.Class : "",
            Subject: findSingleExam.Subject ? findSingleExam.Subject : "",
            Date: findSingleExam.Date ? findSingleExam.Date : "",
            Description: findSingleExam.Description ? findSingleExam.Description : "",
            TotalMarks: findSingleExam.TotalMarks ? findSingleExam.TotalMarks : "",
            FullClassResultPic: findSingleExam.FullClassResultPic ? findSingleExam.FullClassResultPic : "",
        })
    }


    // updating single exam
    async UpdateSingleExam(req, res) {
        const { Class, Title, Date, Description, TotalMarks, Subject, Id } = req.body;
        const findExamAndUpdate = await examModel.findByIdAndUpdate(
            { _id: Id },
            {
                Title,
                Class,
                Subject,
                Date,
                Description,
                TotalMarks
            },
            { new: true, upsert: true }
        )
        res.status(200).json({ message: "updated Successfully!" })
    }







    // get Subjects of Particular exam
    async ExamSubjects(req, res) {
        const ExamTitle = req.query.ExamTitle;
        if (ExamTitle) {
            const findExamSubject = await examModel.find({ Title: ExamTitle });
            res.status(200).json(findExamSubject.map((val, index) => {
                return ({
                    Subject: val.Subject,
                    TotalMarks: val.TotalMarks,
                })
            }
            ))
        }
    }



    // add exam marks of student doc
    async AddExamMarks(req, res) {
        const { ExamTitle, Id, Subject, ObtaineMarks } = req.body;
        const ExamInfoSubjectAndMarks = Subject.split(",");
        const findExamClass = await examModel.findOne({ Title: ExamTitle })

        if (Id) {
            const findStudent = await studentModel.findByIdAndUpdate(
                { _id: Id },
                {
<<<<<<< HEAD
                    $push: {
                        Smarks: {
                            Title: ExamTitle,
                            Class: findExamClass.Class,
                            Subject: ExamInfoSubjectAndMarks[0],
                            TotalMarks: ExamInfoSubjectAndMarks[1],
                            ObtainMarks: ObtaineMarks,
                        }
=======
                    Smarks: {
                        Title: ExamTitle,
                        Class: findExamClass.Class,
                        Subject: ExamInfoSubjectAndMarks[0],
                        TotalMarks: ExamInfoSubjectAndMarks[1],
                        ObtainMarks: ObtaineMarks,
>>>>>>> origin/master
                    }
                },
                { new: true, upsert: true }
            )
            return res.status(200).json({ message: "successfully added marks!" })
        }
        return res.status(400).json({ message: "missing information" })
    }

}
module.exports = new Management()