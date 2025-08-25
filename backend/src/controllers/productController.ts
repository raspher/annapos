import { Request, Response } from 'express';
import { listProducts } from '../services/productService.ts';

export async function getProducts(req: Request, res: Response) {
  try {
    const q = (req.query.q as string) || undefined;
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    const result = await listProducts({ q, categoryId, limit, offset });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
}
