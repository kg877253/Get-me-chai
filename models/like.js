import mongoose from "mongoose"

const LikeSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userEmail: { type: String, required: true },
}, { timestamps: true })

// Ek user ek post ko sirf ek baar like kar sake
LikeSchema.index({ postId: 1, userEmail: 1 }, { unique: true })

export default mongoose.models.Like || mongoose.model("Like", LikeSchema)