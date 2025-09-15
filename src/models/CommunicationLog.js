const mongoose = require("mongoose");

const communicationLogSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    segment: { type: mongoose.Schema.Types.ObjectId, ref: "Segment", required: true },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["SENT", "FAILED"], default: "SENT" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunicationLog", communicationLogSchema);
