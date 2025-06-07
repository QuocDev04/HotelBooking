import Hotel from "../models/hotels.js";
import { v2 as cloudinary } from "cloudinary"
import Room from "../models/rooms.js";
import { StatusCodes } from 'http-status-codes';
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities, nameRoom, capacity, images, hotel: hotelId } = req.body;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Hotel not found with given ID",
            });
        }
        // 3. Parse amenities nếu là JSON string
        let parsedAmenities = [];
        try {
            parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        } catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid amenities format. Must be a JSON array.",
            });
        }

        // 4. Tạo phòng
        const newRoom = await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: Number(pricePerNight),
            nameRoom,
            capacity,
            amenities: parsedAmenities,
            images,
        });

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Room created successfully",
            room: newRoom,
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

export const getRoomAll = async (req, res) => {
    try {
        const room = await Room.find().populate("hotel")
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Get all rooms successfully",
            rooms: room,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}

export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Delete all rooms successfully",
            rooms: room,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isAvailable } = req.body;

        // Tìm phòng theo ID
        const room = await Room.findById(id);
        if (!room) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Room not found with given ID",
            });
        }

        // Cập nhật trạng thái phòng
        room.isAvailable = isAvailable;
        await room.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Room status updated successfully",
            room,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}
export const updateRoom = async (req, res) =>{
    try {
        const { id } = req.params;
        const { roomType, pricePerNight, amenities, nameRoom, capacity, images,hotel } = req.body;

        // Tìm phòng theo ID
        const room = await Room.findById(id);
        if (!room) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Room not found with given ID",
            });
        }

        // Cập nhật thông tin phòng
        room.roomType = roomType;
        room.pricePerNight = Number(pricePerNight);
        room.nameRoom = nameRoom;
        room.capacity = capacity;
        room.amenities = amenities;
        room.images = images;
        room.hotel = hotel;
        await room.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Room updated successfully",
            room,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}

export const getRoomById = async (req,res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id).populate("hotel");
        if (!room) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Room not found with given ID",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Get room by ID successfully",
            room,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}