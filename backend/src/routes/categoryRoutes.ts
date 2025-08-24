import Router, { Request, Response } from 'express';
import dataSource from "../db/dataSource.ts";
import { Category } from "../db/entities/Category.ts";

const router = Router();

// GET /api/categories?q=
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';

    const qb = dataSource.getRepository(Category)
      .createQueryBuilder('category')
      .orderBy('category.name', 'ASC');

    if (q) {
      qb.where('category.name ILIKE :q', { q: `%${q}%` });
    }

    const items = await qb.getMany();

    res.json({ items, total: items.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

export default router;
