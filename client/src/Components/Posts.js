import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createPost, toggleLike, deletePost } from "../Features/PlantSlice";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Tropical", "Succulents & Cacti", "Herbs", "Flowering", "Trees & Shrubs", "Aquatic", "Rare & Exotic"];

const categoryEmojis = {
  Tropical:             "🌴",
  "Succulents & Cacti": "🌵",
  Herbs:                "🌿",
  Flowering:            "🌸",
  "Trees & Shrubs":     "🌳",
  Aquatic:              "🪷",
  "Rare & Exotic":      "🌺",
};

const Posts = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const posts     = useSelector((state) => state.plants.posts);
  const isLoading = useSelector((state) => state.plants.isLoading);
  const email     = useSelector((state) => state.users.user?.email);
  const name      = useSelector((state) => state.users.user?.name);

  const [message,  setMessage]  = useState("");
  const [category, setCategory] = useState("Herbs");
  const [posting,  setPosting]  = useState(false);

  useEffect(() => {
    if (!email) { navigate("/login"); return; }
    dispatch(fetchPosts());
  }, [email, dispatch]);

  const handlePost = async () => {
    if (!message.trim()) return;
    setPosting(true);
    await dispatch(createPost({ author: name, email, message: message.trim(), category }));
    setMessage("");
    setPosting(false);
  };

  const handleLike = (postId) => {
    if (!email) return;
    dispatch(toggleLike({ postId, email }));
  };

  const handleDelete = (postId) => {
    if (window.confirm("Delete this post?")) {
      dispatch(deletePost({ postId, email }));
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });
    } catch { return dateStr; }
  };

  return (
    <div className="posts-page-wrap">

      {/* ── Write Post ── */}
      <div className="write-post-card">
        <h3>🌱 Share a Plant Update</h3>
        <textarea
          className="post-textarea"
          placeholder="What's growing in your garden today?…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
        <div className="write-post-footer">
          <select
            className="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{categoryEmojis[c]} {c}</option>
            ))}
          </select>
          <button
            className="post-submit-btn"
            onClick={handlePost}
            disabled={posting || !message.trim()}
          >
            {posting ? "Posting…" : "Post 🌿"}
          </button>
        </div>
      </div>

      {/* ── Feed ── */}
      {isLoading ? (
        <div className="loading-wrap">🌱 Loading plant updates…</div>
      ) : posts.length === 0 ? (
        <div className="empty-feed">
          <div className="empty-icon">🪴</div>
          <p>No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="posts-feed">
          {posts.map((post) => {
            const emoji     = categoryEmojis[post.category] || "🌿";
            const liked     = post.likes?.includes(email);
            const likeCount = post.likes?.length || 0;
            const isAuthor  = post.email === email;

            return (
              <div key={post._id} className="post-card">

                {/* ── Post Header ── */}
                <div className="post-header">
                  <div className="post-avatar">
                    {post.author ? post.author.charAt(0).toUpperCase() : "🌿"}
                  </div>
                  <div className="post-meta">
                    <div className="post-author">{post.author}</div>
                    <div className="post-date">{formatDate(post.date)}</div>
                  </div>
                  {post.category && (
                    <span className="post-category-badge">
                      {emoji} {post.category}
                    </span>
                  )}
                </div>

                {/* ── Post Body ── */}
                <div className="post-body">{post.message}</div>

                {/* ── Post Footer ── */}
                <div className="post-footer">
                  <button
                    className={`like-btn ${liked ? "liked" : ""}`}
                    onClick={() => handleLike(post._id)}
                  >
                    {liked ? "💚" : "🤍"} {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                  </button>

                  {isAuthor && (
                    <button
                      className="delete-post-btn"
                      onClick={() => handleDelete(post._id)}
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Posts;