import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import Register from "./Components/Register";
import Orders from "./Components/Orders";
import Posts from "./Components/Posts";
import EditProfile from "./Components/EditProfile";
import AdminDashboard from "./Components/AdminDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import ProductDetail from "./Components/ProductDetail";
import Checkout from "./Components/Checkout";
import About from "./Components/About";
import Products from "./Components/Products";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>

            {/* ── Public Routes ── */}
            <Route path="/"            element={<Home />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/about"       element={<About />} />
            <Route path="/products"    element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* ── Protected Routes ── */}
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute><Orders /></ProtectedRoute>
            } />
            <Route path="/posts" element={
              <ProtectedRoute><Posts /></ProtectedRoute>
            } />
            <Route path="/edit-profile" element={
              <ProtectedRoute><EditProfile /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute><Checkout /></ProtectedRoute>
            } />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
