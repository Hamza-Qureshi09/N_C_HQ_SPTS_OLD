const mongoose = require("mongoose")
const Schema = mongoose.Schema

const LeaveSchema = new mongoose.Schema({
    RequestedBy: { type: String, required: true },
    Class: { type: String, required: true },
    ApprovedBy: { type: String, required: false },
    Student: [
        {
            Studentname:{ type: String, required: true },
            StudentRollno:{ type: String, required: true }
        }
    ],
    endDate: { type: Date },
    startDate: { type: Date },
    title: { type: String, required: true },
    DetailApplication: { type: String, required: false },
    Status: { type: String, required: false, enum: ['Approved', 'Reject', 'Pending'], default: 'Pending' },
})

const Leave = new mongoose.model("Leave", LeaveSchema);

module.exports = Leave


