import mongoose from "mongoose";


const roomSchema = new mongoose.Schema({
    nameRoom: { type: String, required: true },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel", 
        required: true,
      },
    capacity: { type: String, required: true },
    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: [{ type: String, required: true }],
    images: [{ type: String, required: true }],
    isAvailable: { type: Boolean, default: true },
    text: { type: String },
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema)

export default Room;