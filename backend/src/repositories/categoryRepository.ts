import annaposDataSource from "../db/dataSource.ts";
import { Category } from "../db/entities/Category.ts";

export class CategoryRepository {
  repo = annaposDataSource.getRepository(Category);

  create(data: Partial<Category>) {
    return this.repo.create(data);
  }

  save(category: Category) {
    return this.repo.save(category);
  }

  async list(q?: string) {
    const qb = this.repo.createQueryBuilder('category').orderBy('category.name', 'ASC');
    if (q) qb.where('category.name ILIKE :q', { q: `%${q}%` });
    const items = await qb.getMany();
    return { items, total: items.length };
  }

  findByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }
}

const categoryRepository = new CategoryRepository();
export default categoryRepository;
