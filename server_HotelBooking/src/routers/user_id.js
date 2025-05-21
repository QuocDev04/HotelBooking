import express from "express";
import { getAllUser } from "../controllers/user_id"; 
const router = express.Router();
router.get('/user', getAllUser)
export default router;
