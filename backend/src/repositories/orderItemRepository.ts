import annaposDataSource from "../db/dataSource.ts";
import { OrderItem } from "../db/entities/OrderItem.ts";

export class OrderItemRepository {
  repo = annaposDataSource.getRepository(OrderItem);

  create(data: Partial<OrderItem>) {
    return this.repo.create(data);
  }

  save(item: OrderItem) {
    return this.repo.save(item);
  }
}

const orderItemRepository = new OrderItemRepository();
export default orderItemRepository;
