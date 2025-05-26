import User from "../models/userModels.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        console.log("Webhook received:", req.headers);
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
            console.error("Missing required headers:", headers);
            return res.status(400).json({ success: false, message: "Missing required headers" });
        }

        // req.body là Buffer do middleware express.raw({type: 'application/json'}) phải được dùng cho webhook route
        const payload = req.body.toString("utf8");
        console.log("Webhook payload:", payload);
        
        const evt = whook.verify(payload, headers);
        console.log("Verified event:", evt);

        const { data, type } = evt;

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
                const createdUser = await User.create(userData);
                console.log("Created user:", createdUser);
                break;

            case "user.updated":
                const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
                if (!updatedUser) {
                    const newUser = await User.create(userData);
                    console.log("Created new user after update:", newUser);
                } else {
                    console.log("Updated user:", updatedUser);
                }
                break;

            case "user.deleted":
                const deletedUser = await User.findByIdAndDelete(data.id);
                console.log("Deleted user:", deletedUser);
                break;

            default:
                console.log("Unhandled event type:", type);
                break;
        }

        return res.status(200).json({ success: true, message: "Webhook received" });
    } catch (error) {
        console.error("Webhook error:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;
