import Router from 'express';
import { authenticateToken } from './middleware.ts';
import { syncFakeStoreController } from '../controllers/syncController.ts'

const router = Router();

router.post('/fakestore', authenticateToken, syncFakeStoreController);

export default router;
