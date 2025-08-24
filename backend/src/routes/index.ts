import Router from 'express';
import authRoutes from './authRoutes.ts';

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);

export default apiRoutes;
