import Router, { Request, Response } from 'express';
import dataSource from "../db/dataSource.ts";
import { Category } from "../db/entities/Category.ts";
import { Product } from "../db/entities/Product.ts";

const router = Router();

router.post('/fakestore', async (req: Request, res: Response) => {
  try {
    // Fetch categories
    const catResp = await fetch('https://fakestoreapi.com/products/categories');
    if (!catResp.ok) throw new Error('Failed to fetch categories');
    const categoryNames: string[] = await catResp.json();

    const categoryRepo = dataSource.getRepository(Category);
    const productRepo = dataSource.getRepository(Product);

    // Upsert categories
    const categoriesMap = new Map<string, Category>();
    for (const name of categoryNames) {
      let category = await categoryRepo.findOne({ where: { name } });
      if (!category) {
        category = categoryRepo.create({ name });
        await categoryRepo.save(category);
      }
      categoriesMap.set(name, category);
    }

    // Fetch products
    const prodResp = await fetch('https://fakestoreapi.com/products');
    if (!prodResp.ok) throw new Error('Failed to fetch products');
    const products: any[] = await prodResp.json();

    // Upsert products
    for (const p of products) {
      const cat = categoriesMap.get(p.category);
      if (!cat) continue;

      let product = await productRepo.findOne({ where: { externalId: p.id } });
      const payload: Partial<Product> = {
        externalId: p.id,
        title: p.title,
        price: Number(p.price).toFixed(2),
        description: p.description,
        imageUrl: p.image ?? p.imageUrl ?? null,
        ratingRate: p.rating?.rate ?? null,
        ratingCount: p.rating?.count ?? null,
        category: cat,
      };

      if (!product) {
        product = productRepo.create(payload);
      } else {
        Object.assign(product, payload);
      }
      await productRepo.save(product);
    }

    res.json({ message: 'Synchronization completed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Synchronization failed' });
  }
});

export default router;
