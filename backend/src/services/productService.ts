import dataSource from "../db/dataSource.ts";
import { Product } from "../db/entities/Product.ts";

export interface ListProductsParams {
  q?: string;
  categoryId?: number;
  limit?: number;
  offset?: number;
}

export async function listProducts(params: ListProductsParams) {
  const q = params.q || '';
  const categoryId = params.categoryId;
  const limit = params.limit ?? 50;
  const offset = params.offset ?? 0;

  const qb = dataSource.getRepository(Product)
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category')
    .orderBy('product.id', 'ASC')
    .take(Math.min(limit, 100))
    .skip(offset);

  if (q) {
    qb.andWhere('(product.title ILIKE :q OR product.description ILIKE :q)', { q: `%${q}%` });
  }
  if (categoryId) {
    qb.andWhere('category.id = :categoryId', { categoryId });
  }

  const [items, total] = await qb.getManyAndCount();
  return { items, total, limit: Math.min(limit, 100), offset };
}
