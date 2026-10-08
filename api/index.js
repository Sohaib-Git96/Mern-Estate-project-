import express from "express";
import mongoose from 'mongoose';
import userRouter from "./routes/user.route.js";
import dotenv from "dotenv";
dotenv.config()
const app=express();
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log(err)
})
app.use("/api/user",userRouter)
app.listen(3000,()=>{
    console.log("Server Started at the Port 3000!!!")
})