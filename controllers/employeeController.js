const Employee = require("../models/employeeModel");
const Attendance = require("../models/attendanceModel");
const config = require("../db/config")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth_Token } = require("../middleware/authMiddleware");


exports.siginEmployee = async (req, res) => {
    try {

        const { name, email, password, role } = req.body;
        let profile = '';

        if (req.files && req.files.profile && req.files.profile[0]) {
            profile = `profile/${req.files.profile[0].filename}`;
        }

        const existingUser = await Employee.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" });
        }
        const Saltround = 10;
        const hashpassword = await bcrypt.hash(password, Saltround);

        const newEmployee = await Employee.create({
            name,
            email,
            password: hashpassword,
            role,
            profile
        });
        return res.status(200).json({ message: "emloyee User successfull created", newEmployee })
    } catch (error) {
        
        return res.status(400).json({ mesage: "internal error", error: error.message });
    }
};

exports.loginEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOne({ email: req.body.email });
        if (employee) {
            const isPasswordValid = await bcrypt.compare(req.body.password, employee.password);
            if (isPasswordValid) {
                const token = jwt.sign(
                    { id: employee._id },
                    config.secretkey,
                    { expiresIn: "10d" }
                );
                const updatedEmployee = await Employee.findByIdAndUpdate(
                    employee._id,
                    { auth_token: token },
                    { new: true, projection: { password: 0 } }
                );
                return res.status(200).json({
                    message: "Employee successfully logged in",
                    updatedEmployee
                });
            } else {
                return res.status(400).json({ message: "Invalid email or password" });
            }
        } else {
            return res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
       
        return res.status(500).json({ message: "Server error" });
    }
};

exports.logOutEmployee = async (req, res) => {
    try {

        const logOutEmployee = await Employee.findByIdAndUpdate(
            req.userId,
            { auth_token: null },
            { new: true, projection: { password: 0 } }
        );
      
        if (!logOutEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(200).json({ message: "Employee successfully logged out", logOutEmployee });
    } catch (error) {
       
        return res.status(500).json({ message: "Internal server error", error });
    }
};

exports.updateEmployeeById = async (req, res) => {
    try {
        const updatedData = await Employee.findByIdAndUpdate(
            req.userId,
            req.body,
            { new: true, projection: { password: 0, auth_token: 0 } }
        );
        if (!updatedData) {
            return res.status(400).json({ error: "Failed to updatedData" });
        }
        return res.status(200).json({ message: "Employee updated successfully", data: updatedData });
    } catch (error) {
        return res.status(500).json({ message: "internal error" })
    }
};

exports.employeeAttendance = async (req, res) => {
    try {
        const { message } = req.body;
        const Message = message.toLowerCase();
        if (!Message || !['checkin', 'checkout'].includes(Message)) {
            return res.status(400).json({ message: 'Invalid message param Must be "checkin" or "checkout".' });
        }
        const employee = await Employee.findById(req.userId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        const lastAttendance = await Attendance.findOne({ employeeId: req.userId }).sort({ timestamp: -1 });
        if (Message === 'checkin') {
            if (lastAttendance && lastAttendance.message === 'checkin') {
                return res.status(400).json({ message: 'You are already checkin Please checkout before checking in again.' });
            }

            await Attendance.create({
                employeeId: req.userId,
                message: 'checkin'
            });

            employee.active = true;
            employee.inactive = false;
            await employee.save();

            return res.status(200).json({ message: "Checked in successfully.", employee });

        } else if (Message === 'checkout') {
            if (!lastAttendance || lastAttendance.message !== 'checkin') {
                return res.status(400).json({ message: 'You must checkin before checking out.' });
            }

            const previousAttendance = await Attendance.findOne({ employeeId: req.userId }).sort({ timestamp: -1 }).skip(1);
           

            if (previousAttendance && previousAttendance.message === 'checkout') {
                return res.status(400).json({ message: 'You have already checkout Please check in before checking out again.' });
            }
            await Attendance.create({
                employeeId: req.userId,
                message: 'checkout'
            });

            employee.active = false;
            employee.inactive = true;
            await employee.save();

            return res.status(200).json({ message: "Checked out successfully.", employee });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal error", error: error.message });
    }
};
