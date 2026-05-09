import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as ENV from "../config";

const statusColors = {
  Pending:   { bg: "#fff3cd", color: "#856404", dot: "#f0a500" },
  Delivered: { bg: "#d1e7dd", color: "#0f5132", dot: "#28a745" },
};

const Orders = () => {
  const navigate = useNavigate();
  const email    = useSelector((s) => s.users.user?.email);
  const name     = useSelector((s) => s.users.user?.name);

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!email) { navigate("/login"); return; }
    axios.get(`${ENV.SERVER_URL}/orders/${email}`)
      .then(({ data }) => { setOrders(data); setLoading(false); })
      .catch((err) => { setError("Failed to load orders."); setLoading(false); });
  }, [email, navigate]);

  if (!email) return null;

  return (
    <div className="orders-wrap">
      <div className="orders-header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back to Ghars</button>
        <h1>My Orders</h1>
        {name && <p>Showing orders for <strong>{name}</strong></p>}
      </div>

      {loading && <div className="orders-loading">Loading your orders…</div>}
      {error   && <div className="orders-error">{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className="orders-empty">
          <span>🪴</span>
          <p>No orders yet. Start shopping on Ghars!</p>
          <button className="pay-btn primary" onClick={() => navigate("/")}>Shop Now</button>
        </div>
      )}

      <div className="orders-list">
        {orders.map((order) => {
          const sc      = statusColors[order.status] || statusColors.Pending;
          const dt      = new Date(order.date);
          const dateStr = dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
          const timeStr = dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

          return (
            <div className="order-card" key={order._id}>
              <div className="order-card-head">
                <div className="order-meta">
                  <span className="order-date">{dateStr} at {timeStr}</span>
                  <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
                </div>
                <span className="order-status" style={{ background: sc.bg, color: sc.color }}>
                  <span className="status-dot" style={{ background: sc.dot }} />
                  {order.status}
                </span>
              </div>
              <div className="order-items-list">
                {order.items.map((item, i) => (
                  <div className="order-item-row" key={i}>
                    <div className="oi-emoji">
                      <img src={item.image || '/img/logo.png'} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                    </div>
                    <span className="oi-name">{item.name}</span>
                    <span className="oi-qty">× {item.qty}</span>
                    <span className="oi-price">{(item.price * item.qty).toFixed(3)} OMR</span>
                  </div>
                ))}
              </div>
              <div className="order-card-foot">
                <span className="order-total-label">Total Paid</span>
                <span className="order-total-amt">{order.total.toFixed(3)} OMR</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;