const express=require("express");
const router=express.Router();

const adminController=require("../controllers/adminController");
const authMiddleware=require("../middleware/authMiddleware");
const employeeLeaveController=require("../controllers/employeeLeaveController");


router.get("/employees",authMiddleware.auth_Admin,adminController.getAllEmployee);
router.get("/employees/:id",authMiddleware.auth_Admin,adminController.getEmployeeById);
router.delete("/employees/delete/:id",authMiddleware.auth_Admin,adminController.deleteEmployeeById);
router.get("/searchEmployeesAttendance",authMiddleware.auth_Admin,adminController.searchEmployeeAttendance);

// leave
router.get("/leaves", authMiddleware.auth_Admin, employeeLeaveController.getLeaveRequestsByStatus);
router.put("/leave/:leaveId", authMiddleware.auth_Admin, employeeLeaveController.updateLeaveRequest);
router.delete('/leave/:leaveId', authMiddleware.auth_Admin, employeeLeaveController.deleteLeaveRequest);


module.exports=router;
