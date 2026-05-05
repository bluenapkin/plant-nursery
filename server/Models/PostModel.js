import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  author:   { type: String, required: true },
  email:    { type: String, required: true },
  message:  { type: String, required: true },
  category: { type: String, default: "General" },
  likes:    { type: [String], default: [] }, // stores emails who liked
  date:     { type: Date, default: Date.now },
});

export default mongoose.model("posts", PostSchema);