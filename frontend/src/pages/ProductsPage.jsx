import { useEffect, useMemo, useState } from "react";
import { CategoriesAPI, ProductsAPI, SyncAPI } from "../services/api.js";
import Loading from "../components/Loading.jsx";
import { useCart } from "../context/CartContext.jsx";

function useCategories(query) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCategories = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await CategoriesAPI.list({ q: query || undefined });
            setCategories(res.items || []);
        } catch (e) {
            console.error(e);
            setError(String(e.message || e));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, [query]);

    return { categories, loading, error, reload: loadCategories };
}

function useProducts({ query, categoryId, limit, offset }) {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProducts = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await ProductsAPI.list({
                q: query || undefined,
                categoryId: categoryId ? Number(categoryId) : undefined,
                limit,
                offset,
            });
            setProducts(res.items || []);
            setTotal(res.total || 0);
        } catch (e) {
            console.error(e);
            setError(String(e.message || e));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [query, categoryId, limit, offset]);

    return { products, total, loading, error, reload: loadProducts };
}

function ProductCard({ product, onAdd }) {
    return (
        <div className="border border-gray-300 rounded-lg p-3">
            {product.imageUrl && (
                <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="max-w-full max-h-36 object-contain"
                />
            )}
            <div className="font-semibold mt-2">{product.title}</div>
            <div className="text-gray-700">{product.category?.name}</div>
            <div className="mt-1">
                Price: <b>{product.price}</b>
            </div>
            {product.ratingRate != null && (
                <div className="text-gray-500 text-xs">
                    Rating: {product.ratingRate} ({product.ratingCount ?? 0})
                </div>
            )}
            <button className="mt-2 btn" onClick={() => onAdd(product, 1)}>
                Add to Cart
            </button>
        </div>
    );
}

function PaginationControls({ offset, limit, total, setOffset, setLimit }) {
    return (
        <div className="flex gap-2 items-center mt-3">
            <button onClick={() => setOffset(Math.max(0, offset - limit))} disabled={offset === 0}>
                Prev
            </button>
            <span>Page {Math.floor(offset / limit) + 1}</span>
            <button onClick={() => setOffset(offset + limit)} disabled={offset + limit >= total}>
                Next
            </button>
            <span className="ml-3">Per page:</span>
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                {[10, 20, 50, 100].map((n) => (
                    <option key={n} value={n}>
                        {n}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default function ProductsPage() {
    const { add } = useCart();

    const [prodQuery, setProdQuery] = useState("");
    const [catQuery, setCatQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);

    const [syncing, setSyncing] = useState(false);
    const [info, setInfo] = useState("");

    const { categories, loading: categoriesLoading } = useCategories(catQuery);
    const { products, total, loading: productsLoading, error: productsError, reload: reloadProducts } = useProducts({
        query: prodQuery,
        categoryId: selectedCategoryId,
        limit,
        offset,
    });

    const selectedCategory = useMemo(() => {
        const idNum = Number(selectedCategoryId);
        return categories.find((c) => c.id === idNum) || null;
    }, [selectedCategoryId, categories]);

    const handleSync = async () => {
        setSyncing(true);
        setInfo("");
        try {
            await SyncAPI.fakestore();
            setInfo("Synchronization completed.");
            reloadProducts();
        } catch (e) {
            console.error(e);
            alert(`Sync failed: ${e.message || e}`);
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="flex gap-2 items-center mb-3">
                <h2 className="mr-auto">Products</h2>
                <button onClick={handleSync} disabled={syncing}>
                    {syncing ? "Syncing..." : "Sync FakeStore"}
                </button>
            </header>

            {info && <p className="text-green-600">{info}</p>}

            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={prodQuery}
                    onChange={(e) => setProdQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && reloadProducts()}
                    className="flex-1 border p-1 rounded"
                />
                <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="min-w-[180px] border p-1 rounded"
                >
                    <option value="">All categories</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <button onClick={reloadProducts} disabled={productsLoading}>
                    Search
                </button>
            </div>

            {categoriesLoading && <Loading message="Loading categories..." />}
            {productsLoading ? (
                <Loading message="Loading products..." />
            ) : productsError ? (
                <p className="text-red-600">{productsError}</p>
            ) : (
                <>
                    <div className="text-gray-600 mb-2">
                        Showing {products.length} of {total} items
                        {selectedCategory ? ` in '${selectedCategory.name}'` : ""}
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} onAdd={add} />
                        ))}
                    </div>

                    <PaginationControls
                        offset={offset}
                        limit={limit}
                        total={total}
                        setOffset={setOffset}
                        setLimit={setLimit}
                    />
                </>
            )}
        </div>
    );
}
