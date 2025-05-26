import express from 'express'
import "dotenv/config"
import cors from "cors"
import connectDB from './src/config/mongodb.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './src/controllers/clerkWebhooks.js'

connectDB();

const app = express()
app.use(cors())

// ✅ Route webhook phải dùng raw body và đặt TRƯỚC express.json()
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks)
// ✅ Sau đó mới dùng express.json() cho các route khác
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send("API is working"))

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
