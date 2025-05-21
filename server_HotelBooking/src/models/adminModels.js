import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        password_hash: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        full_name: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        profile_picture: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Admin", AdminSchema);
