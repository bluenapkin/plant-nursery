import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
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

// ── Static Files ───────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
app.use("/uploads", express.static(__dirname + "/uploads"));

// ── Multer ─────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "uploads/"); },
  filename:    (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname); },
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
    console.log("📧 Login attempt:", email);
    console.log("🔑 Password received:", password);

    const user = await UserModel.findOne({ email });
    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) return res.status(404).json({ error: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password match:", passwordMatch);

    if (!passwordMatch) return res.status(401).json({ error: "Authentication failed" });

    res.status(200).json({
      user: { name: user.name, email: user.email, profilePic: user.profilePic, role: user.role },
      message: "Login successful",
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
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

      if (req.file) {
        const profilePic = req.file.filename;
        if (userToUpdate.profilePic) {
          const oldFilePath = path.join(__dirname, "uploads", userToUpdate.profilePic);
          fs.unlink(oldFilePath, (err) => {
            if (err) console.error("Error deleting old file:", err);
            else console.log("Old file deleted successfully");
          });
        }
        userToUpdate.profilePic = profilePic;
      }

      // Update name
      userToUpdate.name = name;

      // ✅ Only hash if a NEW password was provided
      if (password) {
        const isSamePassword = await bcrypt.compare(password, userToUpdate.password);
        if (!isSamePassword) {
          userToUpdate.password = await bcrypt.hash(password, 10);
        }
        // if same password, don't touch it
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
    const { userEmail, items, total } = req.body;
    if (!userEmail || !items || items.length === 0)
      return res.status(400).json({ error: "Invalid order data" });
    const order = new OrderModel({ userEmail, items, total });
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

// ── Start Server ───────────────────────────────────
const port = ENV.PORT || 3001;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
console.log("CLIENT_URL:", ENV.CLIENT_URL);
console.log("DB_USER:", ENV.DB_USER);