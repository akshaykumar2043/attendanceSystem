const Leave = require("../models/leaveModel");
const Employee = require("../models/employeeModel");


exports.createLeaveRequest = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        if (!startDate || !endDate || startDate > endDate) {
            return res.status(400).json({ message: 'Invalid date range.' });
        }
        const newLeave = await Leave.create({
            employeeId: req.userId,
            startDate,
            endDate,
            reason
        });
        return res.status(201).json({
            message: 'Leave request created successfully',
            leave: newLeave
        });
    } catch (error) {
        console.error('Error creating leave request:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateLeaveRequest = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const { status } = req.body;

        if (!['approved', 'pending', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }
        const updatedLeave = await Leave.findByIdAndUpdate(
            leaveId,
            { status },
            { new: true }
        );
        if (!updatedLeave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        return res.status(200).json({
            message: 'Leave request updated successfully',
            leave: updatedLeave
        });
    } catch (error) {
        console.error('Error updating leave request:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getLeaveRequestsByStatus = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        let skip = (page - 1) * limit;
        const { status } = req.query; 

        let filter = {};

        if (status) {
            filter.status = status;
        }
        const leaveRequests = await Leave.find(filter)
        .sort({ createdAt: 'asc' })
        .skip(skip)
        .limit(limit);
        if(leaveRequests.length===0){
        return res.status(404).json({message:"Leave Not Found!!"});
        }
        const totalLeave=await Leave.countDocuments();
        return res.status(200).json({
            message: 'Leave requests retrieved successfully',
            total: totalLeave,
            page,
            limit,
            leaveRequests
        });
    } catch (error) {
        console.error('Error retrieving leave requests:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteLeaveRequest = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const deletedLeave = await Leave.findByIdAndDelete(leaveId);
        if (!deletedLeave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        return res.status(200).json({
            message: 'Leave request deleted successfully',
            leave: deletedLeave
        });
    } catch (error) {
        console.error('Error deleting leave request:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};



