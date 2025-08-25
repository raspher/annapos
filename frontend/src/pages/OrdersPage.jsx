import { useEffect, useState } from "react";
import Loading from "../components/Loading.jsx";
import { OrdersAPI } from "../services/api.js";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setOrdersLoading(true);
    try {
      const res = await OrdersAPI.list({ limit: 50, offset: 0 });
      setOrders(res.items || []);
      setOrdersTotal(res.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setOrdersLoading(false);
    }
  }

  return (
    <div style={{ paddingRight: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <h2 style={{ margin: 0 }}>Orders</h2>
        <span style={{ color: '#777' }}>({ordersTotal})</span>
        <button style={{ marginLeft: 'auto' }} onClick={loadOrders} disabled={ordersLoading}>{ordersLoading ? 'Refreshing...' : 'Refresh'}</button>
      </div>
      {ordersLoading ? (
        <Loading message="Loading orders..." />
      ) : (
        <div style={{ marginTop: 12 }}>
          {orders.map(o => (
            <details key={o.id} style={{ border: '1px solid #ddd', borderRadius: 6, padding: 8, marginBottom: 8 }}>
              <summary>#{o.id} - {o.status} - Total: {o.total}</summary>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: 8 }}>
                {(o.items || []).map(it => (
                  <li key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>{it.productName} x {it.quantity}</span>
                    <span>{it.productPrice} - {it.lineTotal}</span>
                  </li>
                ))}
              </ul>
              {o.status === 'PENDING' && (
                <button onClick={async () => { await OrdersAPI.complete(o.id); await loadOrders(); }}>Complete Order</button>
              )}
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
