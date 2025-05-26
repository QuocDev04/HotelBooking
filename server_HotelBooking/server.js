import express from 'express'
import "dotenv/config"
import cors from "cors"
import connectDB from './src/config/mongodb.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './src/controllers/clerkWebhooks.js'
import User from './src/models/userModels.js'

connectDB();

const app = express()
app.use(cors())

// Logging middleware cho webhook
app.post("/api/clerk", (req, res, next) => {
    console.log("\n=== Webhook Request Received ===");
    console.log("Time:", new Date().toISOString());
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    next();
}, express.raw({ type: "application/json" }), clerkWebhooks)

// ✅ Sau đó mới dùng express.json() cho các route khác
app.use(express.json())
app.use(clerkMiddleware())

// Route test để kiểm tra MongoDB
app.post('/api/test-user', async (req, res) => {
    try {
        const testUser = {
            _id: 'test_user_' + Date.now(),
            email: 'test@example.com',
            userName: 'Test User',
            image: 'https://example.com/image.jpg',
            recentSearchedCities: []
        };
        
        console.log('Attempting to create test user:', testUser);
        const user = await User.create(testUser);
        console.log('Test user created successfully:', user);
        
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error creating test user:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => res.send("API is working"))

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
