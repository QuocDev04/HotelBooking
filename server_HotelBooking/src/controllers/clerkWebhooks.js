import { Webhook } from "svix";
import User from "../models/userModels.js";

const clerkWebhooks = async (req, res) => {
    try {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        const wh = new Webhook(webhookSecret);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
            return res.status(400).json({ success: false, message: "Missing required headers" });
        }

        // ✅ req.body là Buffer khi dùng express.raw()
        const payload = req.body.toString("utf8");
        const evt = wh.verify(payload, headers); // 🔒 Verify chữ ký

        const { type, data } = evt;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0]?.email_address || "",
            userName: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown",
            image: data.image_url || "",
            recentSearchedCities: [],
        };

        switch (type) {
            case "user.created":
                await User.create(userData);
                break;
            case "user.updated":
                await User.findByIdAndUpdate(data.id, userData, { new: true, upsert: true });
                break;
            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                break;
            default:
                break;
        }

        res.status(200).json({ success: true, message: "Webhook received" });
    } catch (error) {
        console.error("Webhook error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;
