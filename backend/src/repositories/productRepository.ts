import annaposDataSource from "../db/dataSource.ts";
import { Product } from "../db/entities/Product.ts";
import { In } from "typeorm";

export class ProductRepository {
  repo = annaposDataSource.getRepository(Product);

  create(data: Partial<Product>) {
    return this.repo.create(data);
  }

  save(product: Product) {
    return this.repo.save(product);
  }

  async list(params: { q?: string; categoryId?: number; limit?: number; offset?: number }) {
    const q = params.q || '';
    const limit = Math.min(params.limit ?? 50, 100);
    const offset = params.offset ?? 0;

    const qb = this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.id', 'ASC')
      .take(limit)
      .skip(offset);

    if (q) {
      qb.andWhere('(product.title ILIKE :q OR product.description ILIKE :q)', { q: `%${q}%` });
    }
    if (params.categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId: params.categoryId });
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total, limit, offset };
  }

  findByExternalId(externalId: number) {
    return this.repo.findOne({ where: { externalId } as any });
  }

  findByIds(ids: number[]) {
    if (!ids.length) return Promise.resolve([] as Product[]);
    return this.repo.find({ where: { id: In(ids) } });
  }
}

const productRepository = new ProductRepository();
export default productRepository;
