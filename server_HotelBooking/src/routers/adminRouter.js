import express from "express";
import { getAllAdmin } from "../controllers/adminControllers";
const router = express.Router();
router.get('/admin', getAllAdmin)
export default router;
