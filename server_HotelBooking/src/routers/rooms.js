import express from "express"
import { createRoom, deleteRoom, getRoomAll, getRoomById, updateRoom, updateStatus,  } from "../controllers/rooms.js";

const roomRouter = express.Router();

roomRouter.post('/room',createRoom)
roomRouter.get('/room', getRoomAll)
roomRouter.delete('/room/:id', deleteRoom)
roomRouter.put('/updateStatus/:id', updateStatus)
roomRouter.put('/room/:id', updateRoom)
roomRouter.get('/room/:id', getRoomById)



export default roomRouter