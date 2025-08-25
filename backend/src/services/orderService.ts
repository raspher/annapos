import dataSource from "../db/dataSource.ts";
import { Order } from "../db/entities/Order.ts";
import { OrderItem } from "../db/entities/OrderItem.ts";
import { Product } from "../db/entities/Product.ts";
import { In } from "typeorm";

export async function createOrder(items: Array<{ productId: number; quantity: number }>) {
  const productRepo = dataSource.getRepository(Product);
  const orderRepo = dataSource.getRepository(Order);
  const orderItemRepo = dataSource.getRepository(OrderItem);

  const ids = [...new Set(items.map(i => Number(i.productId)).filter(Boolean))];
  const products = ids.length ? await productRepo.find({ where: { id: In(ids) } }) : [];
  const prodMap = new Map<number, Product>();
  for (const p of products) prodMap.set(p.id, p);

  const order = orderRepo.create({ status: 'PENDING', total: '0.00' });
  await orderRepo.save(order);

  let totalCents = 0;
  for (const it of items) {
    const qty = Math.max(1, Number(it.quantity || 1));
    const product = prodMap.get(Number(it.productId));
    if (!product) continue;
    const priceCents = Math.round(Number(product.price) * 100);
    const lineCents = priceCents * qty;
    totalCents += lineCents;

    const oi = orderItemRepo.create({
      order,
      product,
      productName: product.title,
      productPrice: Number(product.price).toFixed(2),
      quantity: qty,
      lineTotal: (lineCents / 100).toFixed(2),
    });
    await orderItemRepo.save(oi);
  }

  order.total = (totalCents / 100).toFixed(2);
  await orderRepo.save(order);
  return orderRepo.findOne({ where: { id: order.id }, relations: ['items', 'items.product'] });
}

export async function completeOrder(id: number) {
  const orderRepo = dataSource.getRepository(Order);
  const order = await orderRepo.findOne({ where: { id } });
  if (!order) return null;
  if (order.status === 'COMPLETED') return order;
  order.status = 'COMPLETED';
  await orderRepo.save(order);
  return orderRepo.findOne({ where: { id }, relations: ['items', 'items.product'] });
}

export async function listOrders({ limit = 50, offset = 0, status }: { limit?: number; offset?: number; status?: string; }) {
  const qb = dataSource.getRepository(Order).createQueryBuilder('order')
    .leftJoinAndSelect('order.items', 'items')
    .leftJoinAndSelect('items.product', 'product')
    .orderBy('order.createdAt', 'DESC')
    .take(Math.min(limit, 100))
    .skip(offset);
  if (status) qb.where('order.status = :status', { status });
  const [items, total] = await qb.getManyAndCount();
  return { items, total, limit: Math.min(limit, 100), offset };
}

export async function getOrder(id: number) {
  return dataSource.getRepository(Order).findOne({ where: { id }, relations: ['items', 'items.product'] });
}

export async function deleteOrder(id: number) {
  const orderRepo = dataSource.getRepository(Order);
  const order = await orderRepo.findOne({ where: { id } });
  if (!order) return false;
  await orderRepo.softRemove(order);
  return true;
}
