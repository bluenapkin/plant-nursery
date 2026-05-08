import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as ENV from "../config";
import Location from "./Location";

const Profile = () => {
  const navigate   = useNavigate();
  const name       = useSelector((state) => state.users.user?.name);
  const email      = useSelector((state) => state.users.user?.email);
  const allPosts   = useSelector((state) => state.plants.posts) || [];
  const reduxPosts = allPosts.filter((post) => post.email === email);
  const profilePic = useSelector((state) => state.users.user?.profilePic);

  const [orders, setOrders] = useState([]);
  const picURL = profilePic ? `${ENV.SERVER_URL}/uploads/${profilePic}` : null;

  useEffect(() => {
    if (!email) { navigate("/login"); return; }
    fetch(`${ENV.SERVER_URL}/orders/${email}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, [email, navigate]);

  if (!email) return null;

  const initial  = name ? name.charAt(0).toUpperCase() : "G";
  const joinDate = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header-bg">
          <div className="profile-avatar-wrap">
            {picURL
              ? <img src={picURL} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              : initial
            }
          </div>
        </div>

        <div className="profile-info">
          <div className="profile-name-row">
            <h2>{name}</h2>
            <button className="edit-profile-btn" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
          </div>

          <p className="profile-email">{email}</p>
          <p style={{ color: "#7a9a7a", fontSize: "0.9rem", marginBottom: "12px" }}>
            Member since {joinDate} · Ghars Community
          </p>

          {/* ── Location ── */}
          <div className="profile-location">
            <h4 style={{ color: "var(--green-dark)", marginBottom: "8px", fontSize: "0.95rem" }}>
              📍 Your Location
            </h4>
            <Location />
          </div>

          {/* ── Stats ── */}
          <div className="profile-stat-row">
            <div className="profile-stat" style={{ cursor: "pointer" }} onClick={() => navigate("/posts")}>
              <div className="stat-num">{reduxPosts.length}</div>
              <div className="stat-label">Posts Shared</div>
            </div>
            <div className="profile-stat">
              <div className="stat-num">{reduxPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0)}</div>
              <div className="stat-label">Total Likes</div>
            </div>
            <div className="profile-stat" style={{ cursor: "pointer" }} onClick={() => navigate("/orders")}>
              <div className="stat-num">{orders.length}</div>
              <div className="stat-label">My Orders</div>
            </div>
          </div>

          {/* ── Recent Posts ── */}
          <div style={{ marginTop: "28px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--green-dark)", fontSize: "1.1rem", marginBottom: "12px" }}>
              My Recent Posts
            </h3>
            {reduxPosts.length === 0 ? (
              <p style={{ color: "#94a894", fontSize: "0.95rem" }}>
                You haven't shared any plant updates yet.{" "}
                <span style={{ color: "var(--green-mid)", cursor: "pointer", fontWeight: 700 }} onClick={() => navigate("/posts")}>
                  Post your first update!
                </span>
              </p>
            ) : (
              <div className="posts-feed">
                {reduxPosts.map((post) => (
                  <div key={post._id || post.id} className="post-card">
                    <div className="post-body">{post.message}</div>
                    <div style={{ fontSize: "0.8rem", color: "#94a894", marginTop: "8px" }}>
                      {post.category} · {post.date}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;