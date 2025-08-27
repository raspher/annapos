import categoryRepository from "../repositories/categoryRepository.js";
import productRepository from "../repositories/productRepository.js";
import {Category, Product} from "../db/entities/Product.js";

export async function syncFakeStore() {
  // Fetch categories
  const catResp = await fetch('https://fakestoreapi.com/products/categories');
  if (!catResp.ok) throw new Error('Failed to fetch categories');
  const categoryNames: string[] = await catResp.json();

  // Upsert categories
  const categoriesMap = new Map<string, Category>();
  for (const name of categoryNames) {
    let category = await categoryRepository.findByName(name);
    if (!category) {
      category = categoryRepository.create({ name });
      await categoryRepository.save(category);
    }
    categoriesMap.set(name, category);
  }

  // Fetch products
  const prodResp = await fetch('https://fakestoreapi.com/products');
  if (!prodResp.ok) throw new Error('Failed to fetch products');
  const products: any[] = await prodResp.json();

  // Upsert products
  for (const p of products) {
    const cat = categoriesMap.get(p.category);
    if (!cat) continue;

    let product = await productRepository.findByExternalId(p.id);
    const payload: Partial<Product> = {
      externalId: p.id,
      title: p.title,
      price: Number(p.price).toFixed(2),
      description: p.description,
      imageUrl: p.image ?? p.imageUrl ?? null,
      ratingRate: p.rating?.rate ?? null,
      ratingCount: p.rating?.count ?? null,
      category: cat,
    };

    if (!product) {
      product = productRepository.create(payload);
    } else {
      Object.assign(product, payload);
    }
    await productRepository.save(product as Product);
  }

  return { message: 'Synchronization completed' };
}
