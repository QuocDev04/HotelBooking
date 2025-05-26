import { Webhook } from "svix";
import User from "../models/userModels.js";

const clerkWebhooks = async (req, res) => {
    try {
        console.log("\n=== Clerk Webhook Received ===");
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        console.log("CLERK_WEBHOOK_SECRET exists:", !!webhookSecret);
        if (!webhookSecret) {
            console.error("❌ CLERK_WEBHOOK_SECRET is missing in environment variables");
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }
        const wh = new Webhook(webhookSecret);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };
        console.log("Headers:", headers);

        if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
            console.error("❌ Missing required headers:", headers);
            return res.status(400).json({ success: false, message: "Missing required headers" });
        }

        // ✅ req.body là Buffer khi dùng express.raw()
        const payload = req.body.toString("utf8");
        console.log("Raw payload:", payload);
        let evt;
        try {
            evt = wh.verify(payload, headers); // 🔒 Verify chữ ký
            console.log("✅ Webhook verified successfully");
        } catch (verifyError) {
            console.error("❌ Invalid webhook signature:", verifyError.message);
            return res.status(400).json({ success: false, message: "Invalid webhook signature" });
        }

        const { type, data } = evt;
        console.log("Event type:", type);
        console.log("User ID:", data.id);

        const userData = {
            _id: data.id,
            email: data.email_addresses[0]?.email_address || "",
            userName: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown",
            image: data.image_url || "",
            recentSearchedCities: [],
        };
        console.log("User data to save:", userData);

        switch (type) {
            case "user.created":
                await User.create(userData);
                console.log("✅ User created");
                break;
            case "user.updated":
                await User.findByIdAndUpdate(data.id, userData, { new: true, upsert: true });
                console.log("✅ User updated");
                break;
            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                console.log("✅ User deleted");
                break;
            default:
                console.log("⚠️ Unhandled event type:", type);
                break;
        }

        res.status(200).json({ success: true, message: "Webhook received" });
    } catch (error) {
        console.error("❌ Webhook error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;
