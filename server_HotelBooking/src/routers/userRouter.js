import express from "express";
import { getAllUser } from "../controllers/userController.js"; 
const router = express.Router();
router.get('/user', getAllUser)
export default router;
