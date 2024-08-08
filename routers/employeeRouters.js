const express=require("express");
const router=express.Router();
const employeeController=require("../controllers/employeeController");
const employeeLeaveController=require("../controllers/employeeLeaveController");
const token=require("../middleware/authMiddleware");
const multer=require("multer");
const fs=require("fs");

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, res, cb) => {
            const directory = "uploads/employeeProfile";
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory)
            }
            cb(null, directory);
        },
        filename: function (req, file, cb) {
            let exitArray = file.originalname.split(".");
            let extension = exitArray[exitArray.length - 1];
            cb(null, Date.now() + "_employee." + extension);
        }
    })
}).fields([
    { name: "profile", minCount: 1 }
]);




router.post("/siginEmployee",upload,employeeController.siginEmployee);
router.post("/loginEmployee",employeeController.loginEmployee);
router.post("/logoutEmployee",token.auth_Token,employeeController.logOutEmployee);
router.put("/employees/update",token.auth_Token,employeeController.updateEmployeeById);
router.post("/employeeAttendance",token.auth_Token,employeeController.employeeAttendance);

//leave
router.post("/leave", token.auth_Token, employeeLeaveController.createLeaveRequest);


module.exports=router;