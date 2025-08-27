import categoryRepository from "../repositories/categoryRepository.js";

export async function listCategories(q?: string) {
  return categoryRepository.list(q);
}
