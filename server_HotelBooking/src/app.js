
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/mongodb.js";
import clerkWebhook from "./controllers/userController.js";
import AdminRouter from "./routers/adminRouter.js";
import { clerkMiddleware } from '@clerk/express'
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(clerkMiddleware());
connectDB();

app.use("/api/clerk", clerkWebhook);
app.use("/api/", AdminRouter);
export const viteNodeApp = app;