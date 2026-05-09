import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "./Home";

const CATEGORIES = ["All", "Fruit Trees", "Citrus", "Tropical", "Stone Fruits"];

const badgeColors = {
  "Best Seller":   { bg: "#111", color: "#fff" },
  "Popular":       { bg: "#f59e0b", color: "#fff" },
  "New":           { bg: "#3b82f6", color: "#fff" },
  "Fast Growing":  { bg: "#10b981", color: "#fff" },
  "Seasonal":      { bg: "#ef4444", color: "#fff" },
  "Quick Harvest": { bg: "#8b5cf6", color: "#fff" },
};

const Products = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState(null);

  // Sync cart to localStorage and notify header
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  const addToCart = (product, e) => {
    e.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => 
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchQ = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="products-wrap">
      {/* ── Shop Section ── */}
      <section className="shop-section">
        <div className="shop-section-head">
          <h2 className="shop-title">Our Collection</h2>
          <p className="shop-sub">Click any plant to learn more</p>
        </div>

        <div className="filter-bar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search plants…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="cat-pills">
            {CATEGORIES.map((c) => (
              <button 
                key={c} 
                className={`cat-pill ${category === c ? "active" : ""}`} 
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="new-product-grid">
          {filtered.map((p) => {
            const bc = badgeColors[p.badge];
            return (
              <div 
                className="new-product-card" 
                key={p.id} 
                onClick={() => navigate(`/product/${p.id}`)}
              >
                {p.badge && (
                  <span 
                    className="new-card-badge" 
                    style={{ background: bc.bg, color: bc.color }}
                  >
                    {p.badge}
                  </span>
                )}
                <div className="new-card-emoji">{p.emoji}</div>
                <div className="new-card-body">
                  <span className="new-card-cat">{p.category}</span>
                  <h3 className="new-card-name">{p.name}</h3>
                  <p className="new-card-desc">{p.desc}</p>
                  <div className="new-card-footer">
                    <div className="new-card-price">
                      <span className="price-amount">{p.price.toFixed(3)}</span>
                      <span className="price-currency"> OMR</span>
                    </div>
                    <button
                      className={`new-add-btn ${addedId === p.id ? "added" : ""}`}
                      onClick={(e) => addToCart(p, e)}
                    >
                      {addedId === p.id ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="shop-empty">
              <span>🌿</span>
              <p>No plants found!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
