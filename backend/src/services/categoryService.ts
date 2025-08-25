import categoryRepository from "../repositories/categoryRepository.ts";

export async function listCategories(q?: string) {
  return categoryRepository.list(q);
}
