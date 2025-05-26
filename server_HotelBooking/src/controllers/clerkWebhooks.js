import User from "../models/userModels.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        console.log("\n=== Webhook Received ===");
        console.log("Time:", new Date().toISOString());
        console.log("Headers:", JSON.stringify(req.headers, null, 2));
        console.log("CLERK_WEBHOOK_SECRET exists:", !!process.env.CLERK_WEBHOOK_SECRET);
        
        if (!process.env.CLERK_WEBHOOK_SECRET) {
            console.error("❌ CLERK_WEBHOOK_SECRET is missing in environment variables");
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
            console.error("❌ Missing required headers:", headers);
            return res.status(400).json({ success: false, message: "Missing required headers" });
        }

        const payload = req.body.toString("utf8");
        console.log("Raw payload:", payload);
        
        try {
            const evt = whook.verify(payload, headers);
            console.log("✅ Webhook verified successfully");
            console.log("Event type:", evt.type);
            console.log("User ID:", evt.data.id);

            const { data, type } = evt;

            const userData = {
                _id: data.id,
                email: data.email_addresses[0]?.email_address || "",
                userName: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown",
                image: data.image_url || "",
                recentSearchedCities: [],
            };

            console.log("User data to save:", JSON.stringify(userData, null, 2));

            switch (type) {
                case "user.created":
                    try {
                        console.log("Attempting to create user...");
                        const createdUser = await User.create(userData);
                        console.log("✅ Successfully created user:", JSON.stringify(createdUser, null, 2));
                    } catch (createError) {
                        console.error("❌ Error creating user:", createError);
                        if (createError.code === 11000) {
                            console.log("User already exists, attempting to update...");
                            const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
                            console.log("✅ Updated existing user:", JSON.stringify(updatedUser, null, 2));
                        } else {
                            throw createError;
                        }
                    }
                    break;

                case "user.updated":
                    try {
                        console.log("Attempting to update user...");
                        const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
                        if (!updatedUser) {
                            console.log("User not found, creating new user...");
                            const newUser = await User.create(userData);
                            console.log("✅ Created new user after update:", JSON.stringify(newUser, null, 2));
                        } else {
                            console.log("✅ Updated user:", JSON.stringify(updatedUser, null, 2));
                        }
                    } catch (updateError) {
                        console.error("❌ Error updating user:", updateError);
                        throw updateError;
                    }
                    break;

                case "user.deleted":
                    try {
                        console.log("Attempting to delete user...");
                        const deletedUser = await User.findByIdAndDelete(data.id);
                        console.log("✅ Deleted user:", JSON.stringify(deletedUser, null, 2));
                    } catch (deleteError) {
                        console.error("❌ Error deleting user:", deleteError);
                        throw deleteError;
                    }
                    break;

                default:
                    console.log("⚠️ Unhandled event type:", type);
                    break;
            }

            return res.status(200).json({ success: true, message: "Webhook processed successfully" });
        } catch (verifyError) {
            console.error("❌ Error verifying webhook:", verifyError);
            return res.status(400).json({ success: false, message: "Invalid webhook signature" });
        }
    } catch (error) {
        console.error("❌ Webhook error:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;
