import {Router} from "express";
import authRoutes from "./auth/authRoutes.js";

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);

export default apiRoutes;