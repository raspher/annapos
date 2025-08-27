import Router from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import syncRoutes from './syncRoutes.js';
import ordersRoutes from './ordersRoutes.js';

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/products', productRoutes);
apiRoutes.use('/categories', categoryRoutes);
apiRoutes.use('/sync', syncRoutes);
apiRoutes.use('/orders', ordersRoutes);

export default apiRoutes;
