import Router, { Request, Response } from 'express';
import dataSource from "../db/dataSource.ts";
import { Order } from "../db/entities/Order.ts";
import { OrderItem } from "../db/entities/OrderItem.ts";
import { Product } from "../db/entities/Product.ts";
import { In } from "typeorm";

const router = Router();

// POST /api/orders
// body: { items: [{ productId: number, quantity: number }] }
router.post('/', async (req: Request, res: Response) => {
  try {
    const items = (req.body?.items as Array<{ productId: number; quantity: number }>) || [];
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    const productRepo = dataSource.getRepository(Product);
    const orderRepo = dataSource.getRepository(Order);
    const orderItemRepo = dataSource.getRepository(OrderItem);

    // Fetch products map
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

    const created = await orderRepo.findOne({ where: { id: order.id }, relations: ['items', 'items.product'] });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// PATCH /api/orders/:id/complete
router.patch('/:id/complete', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const orderRepo = dataSource.getRepository(Order);
    const order = await orderRepo.findOne({ where: { id } });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status === 'COMPLETED') return res.json(order);
    order.status = 'COMPLETED';
    await orderRepo.save(order);
    const updated = await orderRepo.findOne({ where: { id }, relations: ['items', 'items.product'] });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to complete order' });
  }
});

// GET /api/orders?limit=&offset=&status=
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? Math.min(Number(req.query.limit), 100) : 50;
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const status = (req.query.status as string) || undefined;
    const qb = dataSource.getRepository(Order).createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy('order.createdAt', 'DESC')
      .take(limit)
      .skip(offset);
    if (status) qb.where('order.status = :status', { status });
    const [items, total] = await qb.getManyAndCount();
    res.json({ items, total, limit, offset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const order = await dataSource.getRepository(Order).findOne({ where: { id }, relations: ['items', 'items.product'] });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const orderRepo = dataSource.getRepository(Order);
    const order = await orderRepo.findOne({ where: { id } });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await orderRepo.softRemove(order);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

export default router;
