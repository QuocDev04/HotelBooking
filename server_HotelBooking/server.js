import express from 'express'
import "dotenv/config"
import cors from 'cors';
import morgan from "morgan";
import { clerkMiddleware } from '@clerk/express'
import connectDB from './src/config/mongodb.js';
import clerkWebhook from './src/controllers/userController.js';

const app = express()
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(clerkMiddleware());
connectDB();

app.use("/api/clerk", clerkWebhook);

app.get('/', (req,res)=> res.send("API is working line"))

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))