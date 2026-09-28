import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    creatorusername: { type: String, required: true },
    caption: { type: String },
    image: { type: String, default: "" },   // required nahi
    likecount: { type: Number, default: 0 },
},
    { timestamps: true }
)
//isse creator ki new post pehle dikhengi
PostSchema.index({ creatorusername: 1, createdAt: -1 })

export default mongoose.models.Post || mongoose.model("Post", PostSchema);