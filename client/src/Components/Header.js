import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Features/UserSlice";
import logo from "../img/logo.png";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name     = useSelector((state) => state.users.user?.name);
  const role     = useSelector((state) => state.users.user?.role);

  const handleLogout = async () => {
    dispatch(logout());
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/login");
  };

  return (
    <header className="nursery-header">
      <Link to="/" className="brand">
        <img src={logo} alt="Ghars Logo" className="brand-logo" />
      </Link>
      <nav className="nursery-nav">
        <Link to="/">🏡 Home</Link>
        <Link to="/posts">🌿 Posts</Link>
        <Link to="/about">About</Link>
        {role === "admin" && (
          <Link to="/admin">🛠 Admin</Link>
        )}
        <Link to="/profile">👤 {name || "Profile"}</Link>
        <span
          className="logout-btn"
          onClick={handleLogout}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleLogout()}
        >
          Logout
        </span>
      </nav>
    </header>
  );
};

export default Header;