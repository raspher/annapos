import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postOrder } from '../src/controllers/ordersController.js';

vi.mock('../src/services/orderService.ts', () => ({
  createOrder: vi.fn(),
}));

import { createOrder } from '../src/services/orderService.js';

function mockRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('ordersController.postOrder', () => {
  beforeEach(() => vi.resetAllMocks());

  it('returns 400 when items array is missing or empty (erroneous data)', async () => {
    const req: any = { body: { items: [] } };
    const res = mockRes();

    await postOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'No items provided' });
    expect(createOrder).not.toHaveBeenCalled();
  });

  it('returns 201 when order is created', async () => {
    (createOrder as any).mockResolvedValue({ id: 10, status: 'PENDING', total: '0.00' });
    const req: any = { body: { items: [{ productId: 1, quantity: 2 }] } };
    const res = mockRes();

    await postOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 10, status: 'PENDING', total: '0.00' });
  });
});
