import Router from 'express';
import authRoutes from './authRoutes.ts';
import productRoutes from './productRoutes.ts';
import categoryRoutes from './categoryRoutes.ts';
import syncRoutes from './syncRoutes.ts';

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/products', productRoutes);
apiRoutes.use('/categories', categoryRoutes);
apiRoutes.use('/sync', syncRoutes);

export default apiRoutes;
