import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    // supporter ka naam
    name: {
      type: String,
      required: [true, "Naam zaroori hai"],
      trim: true,
      maxlength: 50,
    },

    // creator ka username (User.username)
    to_user: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Razorpay order id (order_xxxx), string hota hai, ObjectId nahi
    oid: {
      type: String,
      required: true,
      unique: true, // ek order = ek payment record
    },

    // Razorpay payment id (pay_xxxx), verify hone ke baad save hoga
    razorpayPaymentId: {
      type: String,
    },

    // rupees me (paise me nahi)
    amount: {
      type: Number,
      required: true,
      min: [1, "Minimum ₹1"],
      max: [100000, "Maximum ₹1,00,000"],
      validate: {
        validator: Number.isInteger,
        message: "Amount whole number hona chahiye",
      },
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },

    // signature verify hone ke baad true
    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt apne aap
  }
);

// supporters leaderboard query ke liye: to_user + done filter, amount sort
PaymentSchema.index({ to_user: 1, done: 1, amount: -1 });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);