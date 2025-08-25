import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/repositories/productRepository.ts', () => ({
  default: {
    list: vi.fn(),
  },
}));

import productRepository from '../src/repositories/productRepository.ts';
import { listProducts } from '../src/services/productService.ts';

describe('productService.listProducts', () => {
  beforeEach(() => vi.resetAllMocks());

  it('delegates to repository with provided params', async () => {
    (productRepository.list as any).mockResolvedValue({ items: [], total: 0, limit: 50, offset: 0 });

    const res = await listProducts({ q: 'phone', categoryId: 2, limit: 5, offset: 10 });

    expect(productRepository.list).toHaveBeenCalledWith({ q: 'phone', categoryId: 2, limit: 5, offset: 10 });
    expect(res).toEqual({ items: [], total: 0, limit: 50, offset: 0 });
  });

  it('works with undefined params (erroneous/missing optional data)', async () => {
    (productRepository.list as any).mockResolvedValue({ items: [], total: 0, limit: 50, offset: 0 });

    const res = await listProducts({});
    expect(productRepository.list).toHaveBeenCalledWith({});
    expect(res.total).toBe(0);
  });
});
