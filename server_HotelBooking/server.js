import express from 'express'
import "dotenv/config"
import cors from "cors"
import connectDB from './src/config/mongodb.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './src/controllers/clerkWebhooks.js'
import router from './src/routers/userRouter.js'
import hotelRouter from './src/routers/hotels.js'
import connectCloudinary from './src/config/clodinary.js'
import roomRouter from './src/routers/rooms.js'
import bookingRouter from './src/routers/Booking.js';

connectDB();
connectCloudinary();
const app = express()
app.use(cors())

app.use("/api/clerk", clerkWebhooks);
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send("API is working"))
app.use('/api/user', router)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
