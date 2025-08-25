import { Request, Response } from 'express';
import { completeOrder, createOrder, deleteOrder, getOrder, listOrders } from '../services/orderService.ts';

export async function postOrder(req: Request, res: Response) {
  try {
    const items = (req.body?.items as Array<{ productId: number; quantity: number }>) || [];
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }
    const created = await createOrder(items);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
}

export async function patchComplete(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updated = await completeOrder(id);
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to complete order' });
  }
}

export async function getOrders(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    const status = (req.query.status as string) || undefined;
    const result = await listOrders({ limit, offset, status });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const order = await getOrder(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
}

export async function deleteOrderById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const ok = await deleteOrder(id);
    if (!ok) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete order' });
  }
}
