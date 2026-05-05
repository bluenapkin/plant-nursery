import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPostLocally } from "../Features/PlantSlice";
import { PlantCategories } from "../ExampleData";

const SharePlant = () => {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Tropical");
  const dispatch = useDispatch();

  const name = useSelector((state) => state.users.user?.name);

  const handlePost = () => {
    if (!message.trim()) {
      alert("Please write something before posting!");
      return;
    }

    const newPost = {
      id: Date.now(),
      author: name || "Anonymous",
      message: message.trim(),
      category,
      date: new Date().toISOString().split("T")[0],
      likes: 0,
    };

    dispatch(addPostLocally(newPost));
    setMessage("");
  };

  return (
    <div className="share-post-card">
      <h3>🌿 Share a Plant Update</h3>
      <textarea
        placeholder="Share a tip, show off a new plant, ask a question… 🌱"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
      />
      <div className="post-controls">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Plant category"
        >
          {PlantCategories.filter((c) => c !== "All Plants").map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button className="btn-post" onClick={handlePost}>
          🌱 Post Update
        </button>
      </div>
    </div>
  );
};

export default SharePlant;
