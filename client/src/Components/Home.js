import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PRODUCTS = [
  { id: 1,  name: "Mango Tree",       emoji: "🥭", image: "/img/Mango Tree.jpg", price: 9.500,  category: "Fruit Trees",  desc: "Sweet & tropical. Thrives in warm climates. Bears fruit in 3–5 years.",       badge: "Best Seller", care: { water: "Twice a week", sun: "Full sun", temp: "25–35°C", difficulty: "Easy" } },
  { id: 2,  name: "Lemon Tree",       emoji: "🍋", image: "/img/Lemon Tree.jpg", price: 7.250,  category: "Citrus",        desc: "Bright and fragrant. Perfect for pots or garden beds. Year-round fruit.",     badge: "Popular",     care: { water: "Every 3 days", sun: "Full sun", temp: "20–30°C", difficulty: "Easy" } },
  { id: 3,  name: "Avocado Tree",     emoji: "🥑", image: "/img/Avocado Tree.jpg", price: 11.500, category: "Fruit Trees",  desc: "Creamy, rich fruit. Loves sunlight. Takes 3–4 years to first harvest.",       badge: "New",         care: { water: "Twice a week", sun: "Full sun", temp: "20–28°C", difficulty: "Medium" } },
  { id: 4,  name: "Orange Tree",      emoji: "🍊", image: "/img/Orange Tree.jpg", price: 8.500,  category: "Citrus",        desc: "Classic citrus beauty. Sweet fruit, glossy leaves, heavenly scent.",          badge: null,          care: { water: "Every 3 days", sun: "Full sun", temp: "20–30°C", difficulty: "Easy" } },
  { id: 5,  name: "Fig Tree",         emoji: "🍈", image: "/img/Fig Tree.jpg", price: 7.750,  category: "Fruit Trees",  desc: "Ancient and resilient. Drought-tolerant. Produces honey-sweet figs.",         badge: null,          care: { water: "Once a week", sun: "Full sun", temp: "18–30°C", difficulty: "Easy" } },
  { id: 6,  name: "Banana Plant",     emoji: "🍌", image: "/img/Banana Tree.jpg", price: 6.500,  category: "Tropical",      desc: "Fast-growing tropical wonder. Giant leaves, sweet fruit clusters.",           badge: "Fast Growing", care: { water: "3x a week", sun: "Full sun", temp: "25–35°C", difficulty: "Easy" } },
  { id: 7,  name: "Pomegranate Tree", emoji: "🍷", image: "/img/Pomegranate Tree.jpg", price: 8.750,  category: "Fruit Trees",  desc: "Jewel-red fruits and stunning blooms. Drought hardy and long-lived.",         badge: null,          care: { water: "Once a week", sun: "Full sun", temp: "20–35°C", difficulty: "Easy" } },
  { id: 8,  name: "Guava Tree",       emoji: "🍃", image: "/img/Guava Tree.jpg", price: 6.900,  category: "Tropical",      desc: "Vitamin-rich tropical fruit. Fast bearer, compact size. Exotic sweetness.",   badge: null,          care: { water: "Twice a week", sun: "Partial sun", temp: "22–30°C", difficulty: "Easy" } },
  { id: 9,  name: "Cherry Tree",      emoji: "🍒", image: "/img/Cherry Tree.jpg", price: 10.500, category: "Stone Fruits", desc: "Spectacular spring blossoms. Delicious summer cherries. A garden showpiece.", badge: "Seasonal",    care: { water: "Twice a week", sun: "Full sun", temp: "15–25°C", difficulty: "Medium" } },
  { id: 10, name: "Peach Tree",       emoji: "🍑", image: "/img/Peach Tree.jpg", price: 9.250,  category: "Stone Fruits", desc: "Velvety soft fruit. Fragrant pink flowers in spring. Loves full sun.",        badge: null,          care: { water: "Twice a week", sun: "Full sun", temp: "18–28°C", difficulty: "Medium" } },
  { id: 11, name: "Apple Tree",       emoji: "🍎", image: "/img/Apple Tree.jpg", price: 10.000, category: "Stone Fruits", desc: "A timeless classic. Crunchy, sweet apples every autumn season.",              badge: null,          care: { water: "Twice a week", sun: "Full sun", temp: "15–25°C", difficulty: "Medium" } },
  { id: 12, name: "Papaya Plant",     emoji: "🍈", image: "/img/Papaya Plant.jpg", price: 5.750,  category: "Tropical",      desc: "Super fast fruiting — as little as 6 months. Tropical, enzyme-rich fruit.",   badge: "Quick Harvest", care: { water: "3x a week", sun: "Full sun", temp: "25–35°C", difficulty: "Easy" } },
];


const CATEGORIES = ["All", "Fruit Trees", "Citrus", "Tropical", "Stone Fruits"];

const badgeColors = {
  "Best Seller":   { bg: "#111", color: "#fff" },
  "Popular":       { bg: "#f59e0b", color: "#fff" },
  "New":           { bg: "#3b82f6", color: "#fff" },
  "Fast Growing":  { bg: "#10b981", color: "#fff" },
  "Seasonal":      { bg: "#ef4444", color: "#fff" },
  "Quick Harvest": { bg: "#8b5cf6", color: "#fff" },
};

const Home = () => {
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
      // Always use fresh product data from PRODUCTS array
      const currentProduct = PRODUCTS.find(p => p.id === product.id) || product;
      return [...prev, { ...currentProduct, qty: 1 }];
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
    <div className="home-wrap">
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">🌿 Ghars — غرس</span>
          <h1 className="hero-title">Bring Nature<br />Into Your Home</h1>
          <p className="hero-desc">
            Rare fruit trees & tropical plants, hand-picked and delivered fresh to your door.
          </p>
          <div className="hero-actions">
            <button 
              className="hero-cta" 
              onClick={() => document.getElementById("shop").scrollIntoView({ behavior: "smooth" })}
            >
              Shop Now →
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-emoji-grid">
            {["🥭", "🍋", "🥑", "🍊", "🍒", "🍎", "🍌", "🍑"].map((e, i) => (
              <div key={i} className="hero-emoji-item" style={{ animationDelay: `${i * 0.1}s` }}>
                {e}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-num">12+</span>
          <span className="stat-label">Plant Varieties</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">100%</span>
          <span className="stat-label">Fresh & Healthy</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">🚚</span>
          <span className="stat-label">Fast Delivery</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">⭐ 4.9</span>
          <span className="stat-label">Customer Rating</span>
        </div>
      </div>

      {/* ── Shop Section ── */}
      <section className="shop-section" id="shop">
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
                <div className="new-card-emoji">
                  <img src={p.image} alt={p.name} style={{ width: '350px', height: '350px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
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

export default Home;
