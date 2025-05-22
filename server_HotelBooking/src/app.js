
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/mongodb.js";
import router from "./routers/userRouter.js";
import AdminRouter from "./routers/adminRouter.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

connectDB();

app.use("/api/", router);
app.use("/api/", AdminRouter);
export const viteNodeApp = app;