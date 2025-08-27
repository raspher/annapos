import Router from 'express';
import { authenticateToken } from './middleware.js';
import { syncFakeStoreController } from '../controllers/syncController.js'

const router = Router();

router.post('/fakestore', authenticateToken, syncFakeStoreController);

export default router;
