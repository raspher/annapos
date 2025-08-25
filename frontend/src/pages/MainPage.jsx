import { useState } from "react";
import { CartProvider } from "../context/CartContext";
import ProductsPage from "./ProductsPage";
import OrdersPage from "./OrdersPage";
import CartPage from "./CartPage";
import { useAuth } from "./../components/Auth.jsx";

const NAV_ITEMS = [
    { label: "Products", view: "PRODUCTS" },
    { label: "Orders", view: "ORDERS" },
    { label: "Cart", view: "CART" },
];

export default function StorePage() {
    const { logout } = useAuth();
    const [view, setView] = useState("PRODUCTS");

    return (
        <CartProvider>
            <Sidebar view={view} setView={setView} logout={logout} />
            <MainContent view={view} />
        </CartProvider>
    );
}

function Sidebar({ view, setView, logout }) {
    return (
        <nav
            style={{
                width: 250,
                height: "100%",        // full viewport height
                position: "fixed",      // always fixed on the left
                top: 0,
                left: 0,
                borderRight: "1px solid #ccc",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                background: "transparent",
            }}
        >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>AnnaPOS</div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {NAV_ITEMS.map((item) => (
                    <li key={item.view}>
                        <button onClick={() => setView(item.view)} style={navBtnStyle(view === item.view)}>
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: "auto" }}>
                <hr style={{ margin: "16px 0" }} />
                <button onClick={logout} style={{ width: "100%" }}>Logout</button>
            </div>
        </nav>
    );
}

function MainContent({ view, marginLeft }) {
    return (
        <section style={{ padding: 16, marginLeft: 250 }}>
            {view === "PRODUCTS" && <ProductsPage />}
            {view === "ORDERS" && <OrdersPage />}
            {view === "CART" && <CartPage />}
        </section>
    );
}

function navBtnStyle(active) {
    return {
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        background: active ? "#1a1a1a" : "transparent",
        border: active ? "1px solid #c7d2fe" : "1px solid transparent",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: active ? 700 : 500,
    };
}
