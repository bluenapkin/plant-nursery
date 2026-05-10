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
  delivery: {
    fullName: String,
    phone: String,
    email: String,
    address: String,
    date: String,
    wilayat: String,
    location: {
      lat: Number,
      lng: Number,
    },
    paymentMethod: String,
  },
  total:  { type: Number, required: true },
  status: { type: String, default: "Pending" },
  date:   { type: Date, default: Date.now },
});

export default mongoose.model("orders", OrderSchema);
