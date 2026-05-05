import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import * as ENV from "../config";

const Checkout = () => {
  const navigate = useNavigate();
  const email    = useSelector((state) => state.users.user?.email);
  const name     = useSelector((state) => state.users.user?.name);

  const [cart,   setCart]   = useState([]);
  const [form,   setForm]   = useState({ cardName: "", cardNum: "", expiry: "", cvv: "" });
  const [paying, setPaying] = useState(false);
  const [done,   setDone]   = useState(false);

  useEffect(() => {
    if (!email) { navigate("/login"); return; }
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, [email]);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const changeQty  = (id, delta) => setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const handlePay = async () => {
    if (!form.cardName || !form.cardNum || !form.expiry || !form.cvv) {
      alert("Please fill in all payment fields.");
      return;
    }
    if (cart.length === 0) { alert("Your cart is empty."); return; }

    setPaying(true);
    try {
      await axios.post(`${ENV.SERVER_URL}/orders`, {
        userEmail: email,
        items: cart.map(({ id, name, emoji, price, qty, category }) => ({ id, name, emoji, price, qty, category })),
        total: cartTotal,
      });
      localStorage.removeItem("cart");
      setDone(true);
    } catch (err) {
      alert(err.response?.data?.error || "Error saving order.");
    } finally {
      setPaying(false);
    }
  };

  if (done) return (
    <div className="checkout-page">
      <div className="checkout-success">
        <span>🌱</span>
        <h2>Order Confirmed!</h2>
        <p>Thank you, <strong>{name || "Plant Lover"}</strong>!<br />Your plants are on their way.</p>
        <button className="pay-btn primary" onClick={() => navigate("/")}>Continue Shopping</button>
        <button className="pay-btn ghost" onClick={() => navigate("/orders")} style={{ marginTop: ".5rem" }}>View My Orders</button>
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      <button className="back-btn" onClick={() => navigate("/")}>← Back to Shop</button>
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-wrap">
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cart.length === 0 ? (
            <div className="orders-empty"><span>🪴</span><p>Your cart is empty.</p></div>
          ) : (
            <>
              {cart.map((item) => (
                <div className="co-item" key={item.id}>
                  <span className="co-emoji">{item.emoji}</span>
                  <div className="co-info">
                    <div className="co-name">{item.name}</div>
                    <div className="co-price">{(item.price * item.qty).toFixed(3)} OMR</div>
                  </div>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.id, +1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>🗑</button>
                </div>
              ))}
              <div className="co-total">
                <span>Total</span>
                <strong>{cartTotal.toFixed(3)} OMR</strong>
              </div>
            </>
          )}
        </div>

        <div className="checkout-form">
          <h2>Payment Details</h2>
          <div className="pay-field">
            <label>Name on Card</label>
            <input placeholder="Name" value={form.cardName} onChange={(e) => setForm({ ...form, cardName: e.target.value })} />
          </div>
          <div className="pay-field">
            <label>Card Number</label>
            <input
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={form.cardNum}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                setForm({ ...form, cardNum: v.replace(/(.{4})/g, "$1 ").trim() });
              }}
            />
          </div>
          <div className="pay-row">
            <div className="pay-field">
              <label>Expiry</label>
              <input
                placeholder="MM / YY"
                maxLength={5}
                value={form.expiry}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                  if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                  setForm({ ...form, expiry: v });
                }}
              />
            </div>
            <div className="pay-field">
              <label>CVV</label>
              <input
                placeholder="123"
                maxLength={3}
                value={form.cvv}
                onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
              />
            </div>
          </div>
          <div className="co-total" style={{ marginTop: "1.5rem" }}>
            <span>Order Total</span>
            <strong>{cartTotal.toFixed(3)} OMR</strong>
          </div>
          <button className="pay-btn primary" style={{ width: "100%", marginTop: "1rem", padding: "1rem" }} onClick={handlePay} disabled={paying}>
            {paying ? "Processing…" : `Pay ${cartTotal.toFixed(3)} OMR`}
          </button>
          <button className="pay-btn ghost" style={{ width: "100%", marginTop: ".5rem" }} onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;