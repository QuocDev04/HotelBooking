import mongoose from "mongoose";


const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    city: {
        type: String, required: true
    },
    district: {
        type: String, required: true
    },
    ward: {
        type: String, required: true
    },
    description: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    photos: [{ type: String }],
    type: {
        type: String,
        enum: ["hotel", "resort", "villa", "hostel", "apartment"],
        default: "hotel"
      },
}, { timestamps: true });

const Hotel = mongoose.model("Hotel", hotelSchema)

export default Hotel;