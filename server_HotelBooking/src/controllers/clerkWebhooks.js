import User from "../models/userModels.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
            return res.status(400).json({ success: false, message: "Missing required headers" });
        }

        // req.body là Buffer do middleware express.raw({type: 'application/json'}) phải được dùng cho webhook route
        const payload = req.body.toString("utf8");
        const evt = whook.verify(payload, headers);

        const { data, type } = evt;

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
                const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
                if (!updatedUser) {
                    // Nếu user chưa có trong db, tạo mới
                    await User.create(userData);
                }
                break;

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                break;

            default:
                // Không cần xử lý event khác
                break;
        }

        return res.status(200).json({ success: true, message: "Webhook received" });
    } catch (error) {
        console.error("Webhook error:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;
