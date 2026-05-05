import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      id:       Number,
      name:     String,
      emoji:    String,
      price:    Number,
      qty:      Number,
      category: String,
    },
  ],
  total:  { type: Number, required: true },
  status: { type: String, default: "Pending" },
  date:   { type: Date, default: Date.now },
});

export default mongoose.model("orders", OrderSchema);