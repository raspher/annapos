import Router from 'express';
import authRoutes from './authRoutes.js';

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);

export default apiRoutes;
