import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Features/UserSlice";
import logo from "../img/logo.png";

const Login = () => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const userEmail = useSelector((state) => state.users.user?.email);
  const isLoading = useSelector((state) => state.users.isLoading);

  const handleLogin = () => {
    if (!email || !password) { alert("Please fill in all fields."); return; }
    dispatch(login({ email, password }));
  };

  useEffect(() => { if (userEmail) navigate("/"); }, [userEmail]);

  return (
    <div className="auth2-page">

      {/* Left Panel */}
      <div className="auth2-left">
        <div className="auth2-left-inner">
          <img src={logo} alt="Ghars" className="auth2-logo" />
          <h1 className="auth2-brand">غرس</h1>
          <p className="auth2-tagline">Your premium plant destination in Oman</p>
          <div className="auth2-features">
            <div className="auth2-feature">Rare fruit trees</div>
            <div className="auth2-feature">Fast delivery</div>
            <div className="auth2-feature">Expert care tips</div>
            <div className="auth2-feature">Plant community</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth2-right">
        <div className="auth2-card">

          <div className="auth2-header">
            <h2>Welcome back</h2>
            <p>Sign in to your Ghars account</p>
          </div>

          <div className="auth2-field">
            <label>Email Address</label>
            <div className="auth2-input-wrap">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          <div className="auth2-field">
            <label>Password</label>
            <div className="auth2-input-wrap">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button className="auth2-show-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button className="auth2-btn" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Signing in…" : "Sign In"}
          </button>

          <div className="auth2-divider"><span>or</span></div>

          <p className="auth2-switch">
            Don't have an account?{" "}
            <Link to="/register">Create one free</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;