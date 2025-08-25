import 'reflect-metadata';
import Router from 'express';
import { authenticateToken } from './middleware.ts';
import { login, logout, cookie } from '../controllers/authController.ts';

const router = Router();

router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.get('/cookie', authenticateToken, cookie);

export default router;
