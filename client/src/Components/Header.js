import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { logout } from "../Features/UserSlice";
import logo from "../img/logo.png";
import { PRODUCTS } from "./Home";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name  = useSelector((state) => state.users.user?.name);
  const role  = useSelector((state) => state.users.user?.role);
  const email = useSelector((state) => state.users.user?.email);

  // Cart state
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // Load cart and listen for updates
  useEffect(() => {
    const updateCart = () => {
      const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
      // Merge cart items with current product data to ensure all properties are up to date
      const updatedCart = cartData.map(cartItem => {
        const product = PRODUCTS.find(p => p.id === cartItem.id);
        return product ? { ...product, qty: cartItem.qty } : cartItem;
      });
      setCart(updatedCart);
      const count = updatedCart.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(count);
    };

    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    window.addEventListener('storage', updateCart);

    return () => {
      window.removeEventListener('cartUpdated', updateCart);
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter((i) => i.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const changeQty = (id, delta) => {
    const newCart = cart.map((i) => 
      i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    if (!email) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <header className="nursery-header">
        <Link to="/" className="brand">
          <img src={logo} alt="Ghars Logo" className="brand-logo" />
          <span className="brand-title">غرس</span>
        </Link>
        
        <nav className="nursery-nav">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/products">Products</Link>
          
          {email ? (
            <>
              <Link to="/posts">Posts</Link>
              {role === "admin" && <Link to="/admin">Admin</Link>}
              <Link to="/profile">👤 {name || "Profile"}</Link>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-login-btn">Login</Link>
              <Link to="/register" className="header-register-btn">Register</Link>
            </>
          )}

          {/* Cart Button */}
          <button className="header-cart-btn" onClick={() => setCartOpen(true)}>
            🛒
            {cartCount > 0 && <span className="header-cart-badge">{cartCount}</span>}
          </button>
        </nav>
      </header>

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          <div className="cart-overlay" onClick={() => setCartOpen(false)} />
          <div className="cart-drawer">
            <div className="drawer-head">
              <h2>🛒 Your Cart {cartCount > 0 && `(${cartCount})`}</h2>
              <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <span>🪴</span>
                  Your cart is empty.<br />Add some plants!
                </div>
              ) : cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="ci-emoji">
                    <img src={item.image || '/img/logo.png'} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                  </div>
                  <div className="ci-info">
                    <div className="ci-name">{item.name}</div>
                    <div className="ci-price">{(item.price * item.qty).toFixed(3)} OMR</div>
                  </div>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.id, +1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>🗑</button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="drawer-footer">
                <div className="total-row">
                  <span className="total-label">Total</span>
                  <span className="total-amt">{cartTotal.toFixed(3)} OMR</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  {email ? "Proceed to Checkout →" : "Login to Checkout →"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Header;
