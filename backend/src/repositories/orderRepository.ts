import annaposDataSource from "../db/dataSource.js";
import { Order } from "../db/entities/Order.js";

export class OrderRepository {
  repo = annaposDataSource.getRepository(Order);

  create(data: Partial<Order>) {
    return this.repo.create(data);
  }

  save(order: Order) {
    return this.repo.save(order);
  }

  findByIdWithRelations(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['items', 'items.product'] });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async list(params: { limit?: number; offset?: number; status?: string }) {
    const limit = Math.min(params.limit ?? 50, 100);
    const offset = params.offset ?? 0;
    const qb = this.repo.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy('order.createdAt', 'DESC')
      .take(limit)
      .skip(offset);
    if (params.status) qb.where('order.status = :status', { status: params.status });
    const [items, total] = await qb.getManyAndCount();
    return { items, total, limit, offset };
  }

  softRemove(order: Order) {
    return this.repo.softRemove(order);
  }
}

const orderRepository = new OrderRepository();
export default orderRepository;
