const express = require("express");
const bodyParser = require("body-parser");
const employeeRouter = require("./routers/employeeRouters");

const adminRouter = require("./routers/adminRouter");
const app = express();
const env = require("dotenv");

env.config();

const Port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use("/api", employeeRouter);
app.use("/api", adminRouter);
require("./db/connection");
app.listen(Port, () => console.log(`server started at PORT:${Port}`));
