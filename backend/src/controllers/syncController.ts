import { Request, Response } from 'express';
import { syncFakeStore } from '../services/syncService.js';

export async function syncFakeStoreController(req: Request, res: Response) {
  try {
    const result = await syncFakeStore();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Synchronization failed' });
  }
}
