import productRepository from "../repositories/productRepository.ts";

export interface ListProductsParams {
  q?: string;
  categoryId?: number;
  limit?: number;
  offset?: number;
}

export async function listProducts(params: ListProductsParams) {
  return productRepository.list(params);
}
