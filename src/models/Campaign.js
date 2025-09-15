const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    segment: { type: mongoose.Schema.Types.ObjectId, ref: "Segment", required: true },
    message: { type: String, required: true },           
    audienceSize: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    deliveryLog: [
      {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        status: { type: String, enum: ["SENT", "FAILED"], default: "SENT" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    scheduledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
