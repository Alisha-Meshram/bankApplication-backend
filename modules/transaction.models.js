import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["deposite", "send"], required: true },
  amount: { type: Number, required: true },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.type === "send";
    },
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.type === "send";
    },
  },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
});

export const Transaction=mongoose.model('Transaction',transactionSchema)