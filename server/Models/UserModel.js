import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profilePic: String,
  role:{ type: String, default: "user" },
});

const UserModel = mongoose.model("userInfos", UserSchema);

export default UserModel;