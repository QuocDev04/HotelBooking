import { StatusCodes } from "http-status-codes"
import UserSchema from "../models/userModels.js"
import { Webhook } from "svix"


const clerkWebhook = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        const headers = {
            "svix-id" : req.header['svix-id'],
            "svix-timestamp": req.header['svix-timestamp'],
            "svix-signature": req.header['svix-signature']
        }

        await whook.verify(JSON.stringify(req.body), headers)

        const { data, type } = req.body

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        }

        switch (type) {
            case "user.created": {
                await User.create(userData)
                break;
            }

            case "user.updated": {
                await User.findByIdAndUpdated(data.id, userData)
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDeleted(data.id)
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
export default clerkWebhook;
// export const getAllUser = async (req, res) => {
//     try {
//         const getAllUser = await UserSchema.find()
//         res.json(getAllUser)
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).json({
//             message: "fix"
//         })
//     }
// }