import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import UserModel from "./Models/UserModel.js";
import OrderModel from "./Models/OrderModel.js";
import PostModel from "./Models/PostModel.js";
import dns from "dns";
import * as ENV from "./config.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// ── CORS ───────────────────────────────────────────
app.use(cors({
  origin: ENV.CLIENT_URL || "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Cloudinary Setup ───────────────────────────────
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key:    ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

// ── Multer Cloudinary Storage ──────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "ghars-profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const upload = multer({ storage });

// ── Database ───────────────────────────────────────
const connectString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=ClusterGreen`;

mongoose.connect(connectString)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => { console.log("❌ DB Error:", err); process.exit(1); });

// ── Register ───────────────────────────────────────
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(409).json({ error: "User already exists" });
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedpassword });
    await user.save();
    res.status(201).json({ user: { name: user.name, email: user.email }, msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// ── Login ──────────────────────────────────────────
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Authentication failed" });
    res.status(200).json({
      user: { name: user.name, email: user.email, profilePic: user.profilePic, role: user.role },
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Logout ─────────────────────────────────────────
app.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// ── Update User Profile ────────────────────────────
app.put(
  "/updateUserProfile/:email/",
  upload.single("profilePic"),
  async (req, res) => {
    const email    = req.params.email;
    const name     = req.body.name;
    const password = req.body.password;

    try {
      const userToUpdate = await UserModel.findOne({ email });
      if (!userToUpdate) return res.status(404).json({ error: "User not found" });

      // ✅ Cloudinary gives full URL in req.file.path
      if (req.file) {
        // Delete old image from Cloudinary if exists
        if (userToUpdate.profilePic && userToUpdate.profilePic.includes("cloudinary")) {
          const publicId = "ghars-profiles/" + userToUpdate.profilePic.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
        userToUpdate.profilePic = req.file.path; // Full Cloudinary URL
      }

      userToUpdate.name = name;

      if (password) {
        const isSamePassword = await bcrypt.compare(password, userToUpdate.password);
        if (!isSamePassword) {
          userToUpdate.password = await bcrypt.hash(password, 10);
        }
      }

      await userToUpdate.save();
      res.send({ user: userToUpdate, msg: "Updated." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ── Save Order ─────────────────────────────────────
app.post("/orders", async (req, res) => {
  try {
    const { userEmail, items, total, delivery } = req.body;
    if (!userEmail || !items || items.length === 0)
      return res.status(400).json({ error: "Invalid order data" });
    const order = new OrderModel({ userEmail, items, total, delivery });
    const saved = await order.save();
    res.status(201).json({ message: "Order saved successfully", orderId: saved._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to save order" });
  }
});

// ── Get Orders by User ─────────────────────────────
app.get("/orders/:email", async (req, res) => {
  try {
    const orders = await OrderModel.find({ userEmail: req.params.email }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get All Posts ──────────────────────────────────
app.get("/posts", async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ date: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Create Post ────────────────────────────────────
app.post("/posts", async (req, res) => {
  try {
    const { author, email, message, category } = req.body;
    if (!author || !email || !message)
      return res.status(400).json({ error: "Missing required fields" });
    const post = new PostModel({ author, email, message, category });
    const saved = await post.save();
    res.status(201).json({ post: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Toggle Like ────────────────────────────────────
app.put("/posts/:id/like", async (req, res) => {
  try {
    const { email } = req.body;
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    const alreadyLiked = post.likes.includes(email);
    post.likes = alreadyLiked
      ? post.likes.filter((e) => e !== email)
      : [...post.likes, email];
    const saved = await post.save();
    res.json({ post: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Delete Post ────────────────────────────────────
app.delete("/posts/:id", async (req, res) => {
  try {
    const { email } = req.body;
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.email !== email) return res.status(403).json({ error: "Not authorized" });
    await PostModel.findByIdAndDelete(req.params.id);
    res.json({ msg: "Post deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get All Users (Admin) ──────────────────────────
app.get("/admin/users", async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 }).sort({ _id: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get All Orders (Admin) ─────────────────────────
app.get("/admin/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Update Order Status (Admin) ────────────────────
app.put("/admin/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await OrderModel.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ order, msg: "Status updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Delete User (Admin) ────────────────────────────
app.delete("/admin/users/:id", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get All Posts (Admin) ──────────────────────────
app.get("/admin/posts", async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Delete Post (Admin) ────────────────────────────
app.delete("/admin/posts/:id", async (req, res) => {
  try {
    const post = await PostModel.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ msg: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start Server ───────────────────────────────────
const port = ENV.PORT || 3001;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));