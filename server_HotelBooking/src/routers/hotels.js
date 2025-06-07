import express from 'express'
import { AddHotel, DeleteHotel, GetAllHotels, getHotelById, UpdataHotel } from '../controllers/hotels.js'

const hotelRouter = express.Router()

hotelRouter.post('/hotel', AddHotel)
hotelRouter.get('/hotel', GetAllHotels)
hotelRouter.put('/hotel/:id', UpdataHotel)
hotelRouter.delete('/hotel/:id', DeleteHotel)
hotelRouter.get('/hotel/:id', getHotelById)

export default hotelRouter