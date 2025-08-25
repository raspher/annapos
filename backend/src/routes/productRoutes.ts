import Router from 'express';
import { getProducts } from '../controllers/productController.ts';
import {authenticateToken} from "./middleware.js";

const router = Router();

// GET /api/products?q=&categoryId=&limit=&offset=
router.get('/', authenticateToken, getProducts);

export default router;
