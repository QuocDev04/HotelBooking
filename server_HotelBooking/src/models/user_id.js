import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        user_id: {
            type: Number,
            required: true,
            unique: true,
        },
        username: {
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
        },
        phone_number: {
            type: String,
        },
        address: {
            type: String,
        },
        profile_picture: {
            type: String,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
        updated_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false, 
        versionKey: false,
    }
);

export default mongoose.model("User", UserSchema);
