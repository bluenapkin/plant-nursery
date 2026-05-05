import { useSelector } from "react-redux";
import { PlantCategories } from "../ExampleData";

const User = () => {
  const name = useSelector((state) => state.users.user?.name);
  const email = useSelector((state) => state.users.user?.email);

  // Derive initials or a plant emoji avatar
  const initial = name ? name.charAt(0).toUpperCase() : "🌿";

  return (
    <>
      {/* User card */}
      <div className="user-card">
        <div className="user-avatar">{initial}</div>
        <div className="user-name">{name || "Plant Lover"}</div>
        <div className="user-email">{email}</div>
        <span className="user-badge">🌱 Community Member</span>
      </div>

      {/* Plant categories */}
      <div className="category-card">
        <h4>Browse Categories</h4>
        {PlantCategories.map((cat) => (
          <span key={cat} className="category-tag">
            {cat}
          </span>
        ))}
      </div>
    </>
  );
};

export default User;
