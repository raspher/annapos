import Router from 'express';
import authRoutes from './authRoutes.js';

const apiRoutes = Router();

apiRoutes.use('/routes', authRoutes);

export default apiRoutes;
