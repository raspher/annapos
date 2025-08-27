import 'reflect-metadata';
import Router from 'express';
import { authenticateToken } from './middleware.js';
import { login, logout, cookie } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.get('/cookie', authenticateToken, cookie);

export default router;
