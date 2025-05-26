import express from 'express'
import "dotenv/config"
import cors from "cors"
import connectDB from './src/config/mongodb.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './src/controllers/clerkWebhooks.js'

connectDB();

const app = express()
app.use(cors())

app.use(express.json())
app.use(clerkMiddleware())

app.use("/api/clerk",clerkWebhooks)

app.get('/', (req,res)=> res.send("API is working"))

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))