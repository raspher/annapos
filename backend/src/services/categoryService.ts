import dataSource from "../db/dataSource.ts";
import { Category } from "../db/entities/Category.ts";

export async function listCategories(q?: string) {
  const qb = dataSource.getRepository(Category)
    .createQueryBuilder('category')
    .orderBy('category.name', 'ASC');

  if (q) {
    qb.where('category.name ILIKE :q', { q: `%${q}%` });
  }

  const items = await qb.getMany();
  return { items, total: items.length };
}
