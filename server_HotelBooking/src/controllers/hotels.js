import Hotel from "../models/hotels.js";
import { StatusCodes } from "http-status-codes"


export const AddHotel = async (req,res) =>{
    try {
        const hotel = await Hotel.create(req.body)
        return res.status(StatusCodes.CREATED).json(hotel)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

export const GetAllHotels = async (req,res) =>{
    try {
        const hotels = await Hotel.find()
        return res.status(StatusCodes.OK).json(hotels)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

export const UpdataHotel = async ( req, res) => {
try {
    const updateHotel = await Hotel.findByIdAndUpdate(req.params.id, res.body)
    return res.status(StatusCodes.OK).json(updateHotel)
} catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
}
}

export const DeleteHotel = async (req,res) =>{
    try {
        const deleteHotel = await Hotel.findByIdAndDelete(req.params.id)
        return res.status(StatusCodes.OK).json(deleteHotel)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

export const getHotelById = async (req,res)=>{
    try {
        const getHotelId = await Hotel.findById(req.params.id)
        return res.status(StatusCodes.OK).json(getHotelId)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}