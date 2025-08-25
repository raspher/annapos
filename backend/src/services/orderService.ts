import orderRepository from "../repositories/orderRepository.ts";
import orderItemRepository from "../repositories/orderItemRepository.ts";
import productRepository from "../repositories/productRepository.ts";
import { Product } from "../db/entities/Product.ts";

export async function createOrder(items: Array<{ productId: number; quantity: number }>) {
  // Fetch products via ProductRepository
  const ids = [...new Set(items.map(i => Number(i.productId)).filter(Boolean))];
  const products = await productRepository.findByIds(ids);
  const prodMap = new Map<number, Product>();
  for (const p of products) prodMap.set(p.id, p as Product);

  const order = orderRepository.create({ status: 'PENDING', total: '0.00' } as any);
  await orderRepository.save(order);

  let totalCents = 0;
  for (const it of items) {
    const qty = Math.max(1, Number(it.quantity || 1));
    const product = prodMap.get(Number(it.productId));
    if (!product) continue;
    const priceCents = Math.round(Number(product.price) * 100);
    const lineCents = priceCents * qty;
    totalCents += lineCents;

    const oi = orderItemRepository.create({
      order: order as any,
      product: product as any,
      productName: product.title,
      productPrice: Number(product.price).toFixed(2),
      quantity: qty,
      lineTotal: (lineCents / 100).toFixed(2),
    } as any);
    await orderItemRepository.save(oi as any);
  }

  (order as any).total = (totalCents / 100).toFixed(2);
  await orderRepository.save(order as any);
  return orderRepository.findByIdWithRelations((order as any).id);
}

export async function completeOrder(id: number) {
  const order = await orderRepository.findById(id);
  if (!order) return null;
  if ((order as any).status === 'COMPLETED') return order;
  (order as any).status = 'COMPLETED';
  await orderRepository.save(order as any);
  return orderRepository.findByIdWithRelations(id);
}

export async function listOrders({ limit = 50, offset = 0, status }: { limit?: number; offset?: number; status?: string; }) {
  return orderRepository.list({ limit, offset, status });
}

export async function getOrder(id: number) {
  return orderRepository.findByIdWithRelations(id);
}

export async function deleteOrder(id: number) {
  const order = await orderRepository.findById(id);
  if (!order) return false;
  await orderRepository.softRemove(order as any);
  return true;
}
