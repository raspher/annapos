import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { OrdersAPI } from "../services/api.js";
import Loading from "../components/Loading.jsx";

export default function CartPage() {
  const { cart, updateQty, remove, total, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const hasItems = cart.length > 0;
  const cartTotal = useMemo(() => total, [total]);

  async function submitOrder() {
    if (!hasItems) return;
    setSubmitting(true);
    setError("");
    setInfo("");
    try {
      const payload = cart.map(i => ({ productId: i.productId, quantity: i.quantity }));
      const order = await OrdersAPI.create(payload);
      clear();
      setInfo(`Order #${order.id} created. Status: ${order.status}.`);
    } catch (e) {
      console.error(e);
      setError(`Failed to create order: ${e.message || e}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2>Cart</h2>
      {info && <p style={{ color: "green" }}>{info}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!hasItems ? (
        <p>No items in cart.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cart.map(item => (
            <li key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.title}</div>
                <div style={{ color: '#555' }}>Price: {item.price.toFixed(2)}</div>
              </div>
              <input type="number" min={1} value={item.quantity} onChange={e => updateQty(item.productId, Number(e.target.value))} style={{ width: 64 }} />
              <button onClick={() => remove(item.productId)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 8, fontWeight: 600 }}>Total: {cartTotal.toFixed(2)}</div>
      <button onClick={submitOrder} disabled={!hasItems || submitting} style={{ marginTop: 8 }}>{submitting ? 'Sending...' : 'Send Order'}</button>
    </div>
  );
}
