import { StatusCodes } from "http-status-codes"
import AdminSchema from "../models/adminModels.js"



export const getAllAdmin = async (req, res) => {
    try {
        const getAllAdmin = await AdminSchema.find()
        res.json(getAllAdmin)
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: "fix"
        })
    }
}