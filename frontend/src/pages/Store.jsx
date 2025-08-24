import { useEffect, useMemo, useState } from "react";
import { CategoriesAPI, ProductsAPI, SyncAPI } from "../services/api.js";
import Loading from "../components/Loading.jsx";
import { useAuth } from "../components/Auth.jsx";

export default function StorePage() {
    const { logout } = useAuth();

    const [catQuery, setCatQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const [prodQuery, setProdQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [products, setProducts] = useState([]);
    const [productsTotal, setProductsTotal] = useState(0);
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);
    const [productsLoading, setProductsLoading] = useState(true);

    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const selectedCategory = useMemo(() => {
        const idNum = Number(selectedCategoryId);
        return categories.find(c => c.id === idNum) || null;
    }, [selectedCategoryId, categories]);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        setOffset(0); // reset paging when filters change
    }, [prodQuery, selectedCategoryId]);

    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prodQuery, selectedCategoryId, limit, offset]);

    async function loadCategories() {
        setCategoriesLoading(true);
        setError("");
        try {
            const res = await CategoriesAPI.list({ q: catQuery || undefined });
            setCategories(res.items || []);
        } catch (e) {
            console.error(e);
            setError(String(e.message || e));
        } finally {
            setCategoriesLoading(false);
        }
    }

    async function loadProducts() {
        setProductsLoading(true);
        setError("");
        try {
            const res = await ProductsAPI.list({
                q: prodQuery || undefined,
                categoryId: selectedCategoryId ? Number(selectedCategoryId) : undefined,
                limit,
                offset,
            });
            setProducts(res.items || []);
            setProductsTotal(res.total || 0);
        } catch (e) {
            console.error(e);
            setError(String(e.message || e));
        } finally {
            setProductsLoading(false);
        }
    }

    async function handleSync() {
        setSyncing(true);
        setInfo("");
        setError("");
        try {
            await SyncAPI.fakestore();
            setInfo("Synchronization completed.");
            await Promise.all([loadCategories(), loadProducts()]);
        } catch (e) {
            console.error(e);
            setError(`Sync failed: ${e.message || e}`);
        } finally {
            setSyncing(false);
        }
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar: Categories */}
            <aside style={{ width: 300, padding: 16, borderRight: "1px solid #ddd" }}>
                <h2>Categories</h2>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={catQuery}
                        onChange={(e) => setCatQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && loadCategories()}
                        style={{ flex: 1 }}
                    />
                    <button onClick={loadCategories} disabled={categoriesLoading}>Search</button>
                </div>
                {categoriesLoading ? (
                    <Loading message="Loading categories..." />
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li key="all">
                            <label style={{ display: "block", padding: "4px 0" }}>
                                <input
                                    type="radio"
                                    name="category"
                                    value=""
                                    checked={selectedCategoryId === ""}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                />
                                <span style={{ marginLeft: 8 }}>All products</span>
                            </label>
                        </li>
                        {categories.map((c) => (
                            <li key={c.id}>
                                <label style={{ display: "block", padding: "4px 0" }}>
                                    <input
                                        type="radio"
                                        name="category"
                                        value={c.id}
                                        checked={String(c.id) === String(selectedCategoryId)}
                                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                                    />
                                    <span style={{ marginLeft: 8 }}>{c.name}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
            </aside>

            {/* Main: Products */}
            <main style={{ flex: 1, padding: 16 }}>
                <header style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                    <h2 style={{ margin: 0, marginRight: "auto" }}>Products</h2>
                    <button onClick={handleSync} disabled={syncing}>{syncing ? "Syncing..." : "Sync FakeStore"}</button>
                    <button onClick={logout}>Logout</button>
                </header>

                {info && <p style={{ color: "green" }}>{info}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={prodQuery}
                        onChange={(e) => setProdQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && loadProducts()}
                        style={{ flex: 1 }}
                    />
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        style={{ minWidth: 180 }}
                    >
                        <option value="">All categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <button onClick={loadProducts} disabled={productsLoading}>Search</button>
                </div>

                {productsLoading ? (
                    <Loading message="Loading products..." />
                ) : (
                    <div>
                        <div style={{ marginBottom: 8, color: "#666" }}>
                            Showing {products.length} of {productsTotal} items
                            {selectedCategory ? ` in '${selectedCategory.name}'` : ""}
                        </div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                            gap: 12,
                        }}>
                            {products.map((p) => (
                                <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                                    {p.imageUrl && (
                                        <img src={p.imageUrl} alt={p.title} style={{ maxWidth: "100%", maxHeight: 140, objectFit: "contain" }} />
                                    )}
                                    <div style={{ fontWeight: 600, marginTop: 8 }}>{p.title}</div>
                                    <div style={{ color: "#444" }}>{p.category?.name}</div>
                                    <div style={{ marginTop: 4 }}>Price: <b>{p.price}</b></div>
                                    {p.ratingRate != null && (
                                        <div style={{ color: "#777", fontSize: 12 }}>Rating: {p.ratingRate} ({p.ratingCount ?? 0})</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
                            <button
                                onClick={() => setOffset(Math.max(0, offset - limit))}
                                disabled={offset === 0}
                            >Prev</button>
                            <span>Page {Math.floor(offset / limit) + 1}</span>
                            <button
                                onClick={() => setOffset(offset + limit)}
                                disabled={offset + limit >= productsTotal}
                            >Next</button>
                            <span style={{ marginLeft: 12 }}>Per page:</span>
                            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                                {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}