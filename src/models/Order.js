const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    externalOrderId: { type: String, required: true, unique: true },
    customerExternalId: { type: String, required: true }, 
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);