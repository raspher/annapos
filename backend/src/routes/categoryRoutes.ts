import Router from 'express';
import { getCategories } from '../controllers/categoryController.ts';
import { authenticateToken } from './middleware.ts';

const router = Router();

// GET /api/categories?q=
router.get('/', authenticateToken, getCategories);

export default router;
