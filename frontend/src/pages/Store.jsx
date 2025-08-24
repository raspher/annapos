import { useState } from "react";
import { useAuth } from "../components/Auth.jsx";
import { CartProvider } from "../context/CartContext.jsx";
import ProductsPage from "./ProductsPage.jsx";
import OrdersPage from "./OrdersPage.jsx";
import CartPage from "./CartPage.jsx";

const views = {
  PRODUCTS: "products",
  ORDERS: "orders",
  CART: "cart",
};

export default function StorePage() {
  const { logout } = useAuth();
  const [view, setView] = useState(views.PRODUCTS);

  return (
    <CartProvider>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Left Navigation */}
        <nav style={{ width: 220, borderRight: "1px solid #e5e7eb", padding: 16, background: "#fbfbfb" }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>AnnaPOS</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <li>
              <button
                onClick={() => setView(views.PRODUCTS)}
                style={navBtnStyle(view === views.PRODUCTS)}
              >Products</button>
            </li>
            <li>
              <button
                onClick={() => setView(views.ORDERS)}
                style={navBtnStyle(view === views.ORDERS)}
              >Orders</button>
            </li>
            <li>
              <button
                onClick={() => setView(views.CART)}
                style={navBtnStyle(view === views.CART)}
              >Cart</button>
            </li>
          </ul>

          <div style={{ marginTop: "auto" }}>
            <hr style={{ margin: "16px 0" }} />
            <button onClick={logout} style={{ width: "100%" }}>Logout</button>
          </div>
        </nav>

        {/* Content */}
        <section style={{ flex: 1, padding: 16 }}>
          {view === views.PRODUCTS && <ProductsPage />}
          {view === views.ORDERS && <OrdersPage />}
          {view === views.CART && <CartPage />}
        </section>
      </div>
    </CartProvider>
  );
}

function navBtnStyle(active) {
  return {
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    background: active ? "#eef2ff" : "transparent",
    border: active ? "1px solid #c7d2fe" : "1px solid transparent",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: active ? 700 : 500,
  };
}