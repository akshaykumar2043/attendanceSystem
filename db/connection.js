const mongoose=require("mongoose");
const database=process.env.URL;
mongoose.connect(database).then(()=>console.log("mongodb connected sucessfull")).catch((error)=> console.log("connection error!!!", error));