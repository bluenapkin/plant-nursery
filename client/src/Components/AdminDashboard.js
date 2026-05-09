import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import * as ENV from "../config";

const STATUS_OPTIONS = ["Pending", "Delivered"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const role     = useSelector((state) => state.users.user?.role);
  const email    = useSelector((state) => state.users.user?.email);

  const [tab,     setTab]     = useState("orders");
  const [orders,  setOrders]  = useState([]);
  const [users,   setUsers]   = useState([]);
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email)           { navigate("/login"); return; }
    if (role !== "admin") { navigate("/");      return; }
  }, [email, role, navigate]);

  useEffect(() => {
    if (role !== "admin") return;
    Promise.all([
      axios.get(`${ENV.SERVER_URL}/admin/orders`),
      axios.get(`${ENV.SERVER_URL}/admin/users`),
      axios.get(`${ENV.SERVER_URL}/admin/posts`),
    ]).then(([ordersRes, usersRes, postsRes]) => {
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [role]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(
        `${ENV.SERVER_URL}/admin/orders/${orderId}/status`,
        { status: newStatus }
      );
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, status: data.order.status } : o)
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // ── Delete User ──────────────────────────────────
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;
    try {
      await axios.delete(`${ENV.SERVER_URL}/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  // ── Delete Post ──────────────────────────────────
  const handleDeletePost = async (postId, postAuthor) => {
    if (!window.confirm(`Are you sure you want to delete ${postAuthor}'s post?`)) return;
    try {
      await axios.delete(`${ENV.SERVER_URL}/admin/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  if (loading) return <div className="orders-loading">Loading dashboard…</div>;

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="back-btn" onClick={() => navigate("/")}>← Back to Shop</button>
      </div>

      {/* ── Stats ── */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="asc-num">{orders.length}</div>
          <div className="asc-label">Total Orders</div>
        </div>
        <div className="admin-stat-card">
          <div className="asc-num">{users.length}</div>
          <div className="asc-label">Total Users</div>
        </div>
        <div className="admin-stat-card">
          <div className="asc-num">{posts.length}</div>
          <div className="asc-label">Total Posts</div>
        </div>
        <div className="admin-stat-card">
          <div className="asc-num">{totalRevenue.toFixed(3)}</div>
          <div className="asc-label">Revenue (OMR)</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="admin-tabs">
        <button className={`admin-tab ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>
          Orders
        </button>
        <button className={`admin-tab ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>
          Users
        </button>
        <button className={`admin-tab ${tab === "posts" ? "active" : ""}`} onClick={() => setTab("posts")}>
          Posts
        </button>
      </div>

      {/* ── Orders Tab ── */}
      {tab === "orders" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id-cell">#{order._id.slice(-6).toUpperCase()}</td>
                  <td>{order.userEmail}</td>
                  <td>{order.items.map((i) => `${i.emoji} ${i.name}`).join(", ")}</td>
                  <td><strong>{order.total.toFixed(3)} OMR</strong></td>
                  <td>{new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td>
                    <select
                      className={`status-select ${order.status === "Delivered" ? "delivered" : "pending"}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Users Tab ── */}
      {tab === "users" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="admin-avatar">
                      {u.profilePic
                        ? <img src={`${ENV.SERVER_URL}/uploads/${u.profilePic}`} alt="avatar" className="admin-avatar-img" />
                        : u.name?.charAt(0).toUpperCase()
                      }
                    </div>
                  </td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role === "admin" ? "admin" : "user"}`}>
                      {u.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td>
                    {/* Don't allow admin to delete themselves */}
                    {u.email !== email && (
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDeleteUser(u._id, u.name)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Posts Tab ── */}
      {tab === "posts" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Email</th>
                <th>Message</th>
                <th>Category</th>
                <th>Likes</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id}>
                  <td>{p.author}</td>
                  <td>{p.email}</td>
                  <td className="message-cell" title={p.message}>{p.message.substring(0, 50)}{p.message.length > 50 ? "..." : ""}</td>
                  <td>{p.category || "General"}</td>
                  <td>{p.likes.length}</td>
                  <td>{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td>
                    <button
                      className="admin-delete-btn"
                      onClick={() => handleDeletePost(p._id, p.author)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
