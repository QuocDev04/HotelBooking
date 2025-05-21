
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/mongodb";
import router from "./routers/user_id";
import AdminRouter from "./routers/adminRouter";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

connectDB();

app.use("/api/", router);
app.use("/api/", AdminRouter);
export const viteNodeApp = app;