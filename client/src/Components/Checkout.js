import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import * as ENV from "../config";
import { PRODUCTS } from "./Home";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIcon2xPng from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const Checkout = () => {
  const navigate = useNavigate();
  const email    = useSelector((state) => state.users.user?.email);
  const name     = useSelector((state) => state.users.user?.name);

  const [cart,   setCart]   = useState([]);
  const [form,   setForm]   = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    date: "",
    wilayat: "",
    paymentMethod: "cash",
    cardName: "",
    cardNum: "",
    expiry: "",
    cvv: "",
  });
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [paying, setPaying] = useState(false);
  const [done,   setDone]   = useState(false);

  const wilayats = [
    "Ad Dakhiliyah",
    "Ad Dhahirah",
    "Al Batinah North",
    "Al Batinah South",
    "Al Buraimi",
    "Al Wusta",
    "Ash Sharqiyah North",
    "Ash Sharqiyah South",
    "Dhofar",
    "Muscat",
    "Musandam",
  ];

  const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    iconRetinaUrl: markerIcon2xPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  L.Marker.prototype.options.icon = defaultIcon;

  function LocationPicker({ location }) {
    useMapEvents({
      click(e) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return location.lat && location.lng ? <Marker position={[location.lat, location.lng]} /> : null;
  }

  useEffect(() => {
    if (email) {
      setForm((prev) => ({ ...prev, email, fullName: prev.fullName || name || "" }));
    }
  }, [email, name]);

  useEffect(() => {
    if (!email) { navigate("/login"); return; }
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    // Merge cart items with current product data to ensure all properties are up to date
    const updatedCart = saved.map(cartItem => {
      const product = PRODUCTS.find(p => p.id === cartItem.id);
      return product ? { ...product, qty: cartItem.qty } : cartItem;
    });
    setCart(updatedCart);
  }, [email, navigate]);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const changeQty  = (id, delta) => setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const handlePay = async () => {
    if (cart.length === 0) { alert("Your cart is empty."); return; }
    if (!form.fullName || !form.phone || !form.email || !form.address || !form.date || !form.wilayat) {
      alert("Please fill in all delivery information.");
      return;
    }
    if (!location.lat || !location.lng) {
      alert("Please pin your delivery location on the map.");
      return;
    }
    if (form.paymentMethod === "credit" && (!form.cardName || !form.cardNum || !form.expiry || !form.cvv)) {
      alert("Please fill in all credit card fields.");
      return;
    }

    setPaying(true);
    try {
      await axios.post(`${ENV.SERVER_URL}/orders`, {
        userEmail: email,
        delivery: {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          date: form.date,
          wilayat: form.wilayat,
          location,
          paymentMethod: form.paymentMethod,
        },
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
                  <div className="co-emoji">
                    <img src={item.image || '/img/logo.png'} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                  </div>
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
          <h2>Delivery Information</h2>
          <div className="pay-field">
            <label>Full Name</label>
            <input placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div className="pay-field">
            <label>Phone Number</label>
            <input placeholder="Phone number" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="pay-field">
            <label>Email</label>
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="pay-field">
            <label>Address</label>
            <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="pay-row">
            <div className="pay-field">
              <label>Delivery Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="pay-field">
              <label>Wilayat</label>
              <select value={form.wilayat} onChange={(e) => setForm({ ...form, wilayat: e.target.value })}>
                <option value="">Select wilayat</option>
                {wilayats.map((wilayat) => (
                  <option key={wilayat} value={wilayat}>{wilayat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pay-field">
            <label>Pin your delivery location on the map</label>
            <div className="map-picker" style={{ padding: 0 }}>
              <MapContainer
                center={location.lat && location.lng ? [location.lat, location.lng] : [21.0, 57.0]}
                zoom={6}
                scrollWheelZoom={false}
                style={{ height: "280px", width: "100%", borderRadius: "18px" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker location={location} />
              </MapContainer>
            </div>
            <div style={{ marginTop: "0.85rem", color: "#42543d", fontSize: "0.95rem" }}>
              {location.lat && location.lng ? (
                <span>Location set at {location.lat.toFixed(4)}, {location.lng.toFixed(4)}. Click the map to move it.</span>
              ) : (
                <span>Click the map to set your delivery location.</span>
              )}
            </div>
          </div>

          <h2 style={{ marginTop: "1.5rem" }}>Payment Method</h2>
          <div className="payment-methods">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={form.paymentMethod === "cash"}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              />
              Cash
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="credit"
                checked={form.paymentMethod === "credit"}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              />
              Credit
            </label>
          </div>

          {form.paymentMethod === "credit" && (
            <>
              <h2 style={{ marginTop: "1rem" }}>Credit Card Details</h2>
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
            </>
          )}

          <div className="co-total" style={{ marginTop: "1.5rem" }}>
            <span>Order Total</span>
            <strong>{cartTotal.toFixed(3)} OMR</strong>
          </div>
          <button className="pay-btn primary" style={{ width: "100%", marginTop: "1rem", padding: "1rem" }} onClick={handlePay} disabled={paying}>
            {paying ? "Processing…" : form.paymentMethod === "cash" ? `Place order ${cartTotal.toFixed(3)} OMR` : `Pay ${cartTotal.toFixed(3)} OMR`}
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
