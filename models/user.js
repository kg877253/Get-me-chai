import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    profilepic: { type: String },
    coverpic: { type: String },
    razorpayid: { type: String },
    razorpaysecret: { type: String },
    createdat: { type: Date, default: Date.now },
    updatedat: { type: Date, default: Date.now },
    role: { type: String , enum: ["user", "creator"], default: "user" },
    profilecompleted: { type: Boolean, default: false},
});

export default mongoose.models.User || mongoose.model("User", UserSchema);