import User from "../models/userModels.js";
import { Webhook } from "svix";


const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        await whook.verify(JSON.stringify(req.body), headers);

        const { data, type } = req.body
        const userData = {
            _id: data.id,
            email: data.email.addresses[0].email.address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        }

        switch (type) {
            case "user.created": {
                await User.create(userData);
                break;
            }
            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                break;
            }

            default:
                break;
        }
        res.json({ success: true, message: "Webhook Recieved" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }
}
export default clerkWebhooks;