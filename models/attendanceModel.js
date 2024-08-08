
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    message: {
        type: String,
        enum: ['checkin', 'checkout'],
        required: true
    },

},{timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;