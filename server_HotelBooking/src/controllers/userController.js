import { StatusCodes } from "http-status-codes"
import UserSchema from "../models/userModels.js"



export const getAllUser = async (req, res) => {
    try {
        const getAllUser = await UserSchema.find()
        res.json(getAllUser)
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: "fix"
        })
    }
}