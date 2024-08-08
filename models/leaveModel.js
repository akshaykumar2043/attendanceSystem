// models/leaveModel.js
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'pending'
    },absent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
