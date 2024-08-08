const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
    },
    profile: {
        type: String,
    },
    auth_token:{
        type:String
    },
    active:{
        type: Boolean,
        default: false
    },
    inactive:{
        type: Boolean,
        default: false
    },
    absent: {
        type: Boolean,
        default: false
    },
    isAdmin:{
        type: Boolean,
        default: false,
    }
}, {timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
