import Router, { Request, Response } from 'express';
import dataSource from "../db/dataSource.ts";
import { Product } from "../db/entities/Product.ts";

const router = Router();

// GET /api/products?q=&categoryId=&limit=&offset=
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const limit = req.query.limit ? Math.min(Number(req.query.limit), 100) : 50;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    const qb = dataSource.getRepository(Product)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.id', 'ASC')
      .take(limit)
      .skip(offset);

    if (q) {
      qb.andWhere('(product.title ILIKE :q OR product.description ILIKE :q)', { q: `%${q}%` });
    }

    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }

    const [items, total] = await qb.getManyAndCount();

    res.json({ items, total, limit, offset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

export default router;
