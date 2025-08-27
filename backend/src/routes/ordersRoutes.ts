import Router from 'express';
import { deleteOrderById, getOrderById, getOrders, patchComplete, postOrder } from '../controllers/ordersController.js';
import { authenticateToken } from './middleware.js';

const router = Router();

// POST /api/orders
router.post('/', authenticateToken, postOrder);

// PATCH /api/orders/:id/complete
router.patch('/:id/complete', authenticateToken, patchComplete);

// GET /api/orders
router.get('/', authenticateToken, getOrders);

// GET /api/orders/:id
router.get('/:id', authenticateToken, getOrderById);

// DELETE /api/orders/:id
router.delete('/:id', authenticateToken, deleteOrderById);

export default router;
