import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PRODUCTS } from "./Home";

const difficultyColor = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" };

const ProductDetail = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const email      = useSelector((state) => state.users.user?.email);
  const [added, setAdded] = useState(false);

  useEffect(() => { if (!email) navigate("/login"); }, [email, navigate]);

  const product = PRODUCTS.find((p) => p.id === parseInt(id));
  if (!product) return <div className="pd-notfound">🌿 Plant not found. <button onClick={() => navigate("/")}>Go Back</button></div>;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      const updated = cart.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      localStorage.setItem("cart", JSON.stringify(updated));
    } else {
      localStorage.setItem("cart", JSON.stringify([...cart, { ...product, qty: 1 }]));
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const buyNow = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.id === product.id);
    if (!existing) localStorage.setItem("cart", JSON.stringify([...cart, { ...product, qty: 1 }]));
    navigate("/checkout");
  };

  return (
    <div className="pd-page">
      <button className="back-btn" onClick={() => navigate("/")}>← Back to Shop</button>

      <div className="pd-wrap">

        {/* ── Left — Emoji Display ── */}
        <div className="pd-left">
          <div className="pd-emoji-box">
            <img src={product.image} alt={product.name} style={{ width: '125px', height: '125px', objectFit: 'cover', borderRadius: '8px' }} />
          </div>
          {product.badge && (
            <span className="pd-badge">{product.badge}</span>
          )}
        </div>

        {/* ── Right — Details ── */}
        <div className="pd-right">
          <span className="pd-cat">{product.category}</span>
          <h1 className="pd-name">{product.name}</h1>
          <p className="pd-desc">{product.desc}</p>

          <div className="pd-price">
            <span className="pd-price-num">{product.price.toFixed(3)}</span>
            <span className="pd-price-cur"> OMR</span>
          </div>

          {/* ── Care Tips ── */}
          <div className="pd-care">
            <h3>🌱 Care Guide</h3>
            <div className="pd-care-grid">
              <div className="pd-care-item">
                <span className="care-icon">💧</span>
                <div>
                  <div className="care-label">Watering</div>
                  <div className="care-val">{product.care.water}</div>
                </div>
              </div>
              <div className="pd-care-item">
                <span className="care-icon">☀️</span>
                <div>
                  <div className="care-label">Sunlight</div>
                  <div className="care-val">{product.care.sun}</div>
                </div>
              </div>
              <div className="pd-care-item">
                <span className="care-icon">🌡️</span>
                <div>
                  <div className="care-label">Temperature</div>
                  <div className="care-val">{product.care.temp}</div>
                </div>
              </div>
              <div className="pd-care-item">
                <span className="care-icon">📊</span>
                <div>
                  <div className="care-label">Difficulty</div>
                  <div className="care-val" style={{ color: difficultyColor[product.care.difficulty], fontWeight: 700 }}>
                    {product.care.difficulty}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="pd-actions">
            <button className="pd-add-btn" onClick={addToCart}>
              {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
            </button>
            <button className="pd-buy-btn" onClick={buyNow}>
              Buy Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
