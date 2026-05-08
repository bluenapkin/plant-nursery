import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Features/UserSlice";
import logo from "../img/logo.png";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name     = useSelector((state) => state.users.user?.name);
  const role     = useSelector((state) => state.users.user?.role);
  const email    = useSelector((state) => state.users.user?.email);

  const handleLogout = async () => {
    dispatch(logout());
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/login");
  };

  return (
    <header className="nursery-header">
      <Link to="/" className="brand">
        <img src={logo} alt="Ghars Logo" className="brand-logo" />
        <span className="brand-title">غرس</span>
      </Link>
      <nav className="nursery-nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>

        {email ? (
          <>
            <Link to="/posts">Posts</Link>
            {role === "admin" && <Link to="/admin">Admin</Link>}
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
          </>
        ) : (
          <>
            <Link to="/login"    className="header-login-btn">Login</Link>
            <Link to="/register" className="header-register-btn">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;