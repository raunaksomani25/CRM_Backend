const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    totalSpend: { type: Number, default: 0 },
    visits: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
