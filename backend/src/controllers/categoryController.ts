import { Request, Response } from 'express';
import { listCategories } from '../services/categoryService.js';

export async function getCategories(req: Request, res: Response) {
  try {
    const q = (req.query.q as string) || undefined;
    const result = await listCategories(q);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
}
