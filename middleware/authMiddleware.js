const jwt = require("jsonwebtoken");
const Employee = require("../models/employeeModel",);
const config = require("../db/config");
const env = require("dotenv");
env.config();

module.exports = {
    auth_Token: async (req, res, next) => {
        const token = req.header("Authorization");
        if (!token) { return res.status(400).json({ error: "access denied!!" }) };
        try {
            const decoded = jwt.verify(token, config.secretkey);
            if (decoded && decoded.id) {
                const checkUser = await Employee.findById(decoded.id);
                if (checkUser.auth_token !== token) {
                    return res.status(401).json({ message: "Your session has expired. Please login again!" });
                }
                req.userId = decoded.id;
                next();
            } else {
                req.userId = null;
                next();
            }
        } catch (error) {
            console.error("JWT Verification Error:", error);
            return res.status(500).json({ message: "Invalid token!" });
        }
    },
    auth_Admin: async (req, res, next) => {
        const token = req.header("Authorization");
        if (!token) { return res.status(400).json({ error: "Access denied!!" }); }
        try {
            const decoded = jwt.verify(token, config.secretkey);
            if (decoded && decoded.id) {
                const checkUser = await Employee.findById(decoded.id);
                if (checkUser.auth_token !== token) {return res.status(401).json({ message: "Your session has expired. Please login again!" })}
                if (!checkUser.isAdmin) { return res.status(403).json({ message: "Forbidden: Admin access required" })}
                req.userId = decoded.id;
                return next();
            } else {
                req.userId = null;
                return next();
            }
        } catch (error) {
      
            return res.status(500).json({ message: "Invalid token!!" });
        }
    },


}



 // auth_token: async (req, res, next) => {
    //     const token = req.header("Authorization")
    //     if (!token) {
    //         return res.status(400).json({ error: "Access denied!" });
    //     }
    //     try {
    //         jwt.verify(token, config.secretkey, async function (err, decoded) {
    //             if (err) {
    //                 res.status(401).send("Your session has expired, Please login again.");
    //             } else {
    //                 if (decoded && decoded.id) {
    //                     let checkUser = await Employee.findById(decoded.id);

    //                     if (checkUser.auth_token !== token) {
    //                         return res.status(401).json({ message: "Your session has expired. Please login again!" });
    //                     }

    //                     req.userId = decoded.id;
    //                     req.currentUser = checkUser;
    //                     return next();
    //                 } else {
    //                     req.userId = null;
    //                     return next();
    //                 }
    //             }
    //         });
    //     } catch (error) {
    //         return res.status(500).send("An error occurred while processing your request.");
    //     }
    // },
























