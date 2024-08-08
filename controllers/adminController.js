const Employee = require("../models/employeeModel");
const Attendance = require("../models/attendanceModel");


//employee data
exports.getAllEmployee = async (req, res) => {

    try {

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        let skip = (page - 1) * limit;

        const employee = await Employee.find({}, { password: 0 })
            .sort({ createdAt: 'asc' })
            .skip(skip)
            .limit(limit);;
        console.log(employee);

        if (!employee || employee.length === 0) {
            return res.status(404).json({ message: "No Employee Found" });
        }
        const totalEmployee = await Employee.countDocuments();

        return res.status(200).json({
            message: 'totalEmployee list retrieved successfully',
            total: totalEmployee,
            page,
            limit,
            employee
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving Employee  list', error: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "Employee ID is required" });
        }
        const data = await Employee.findOne({ _id: id }, { password: 0 });
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: "internal error" })
    }
};

exports.deleteEmployeeById = async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id, req.body, { new: true });
        return res.status(200).json({ message: "Employee Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "internal error" });
    }
};

exports.searchEmployeeAttendance = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Please ensure you pick two dates" });
        }

        const rgx = (pattern) => new RegExp(`.*${pattern}.*`, "i");

        const search = (req.query.search || '').toLowerCase();
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let skip = (page - 1) * limit;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const query = [
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employeeId',
                    foreignField: '_id',
                    as: 'employee',
                },
            },
            {
                $unwind: '$employee',
            },
            {
                $match: {
                    'employee.name': { $regex: rgx(search) },
                    createdAt: { $gte: start, $lte: end },
                },
            },
            {
                $facet: {
                    attendances: [
                        { $sort: { createdAt: 1 } },
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    totalAttendances: [
                        { $count: 'total' },
                    ],
                },
            },
        ];

        const result = await Attendance.aggregate(query);
        if (!result.length || !result[0].attendances.length) {
            return res.status(404).json({ message: 'No attendances found!' });
        }
      
        const { attendances, totalAttendances } = result[0];
        const total = totalAttendances.length ? totalAttendances[0].total : 0;
     
        return res.status(200).json({
            message: 'Attendance list retrieved successfully',
            total,
            page,
            limit,
            attendances,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving attendance list', error: error.message });
    }
};

