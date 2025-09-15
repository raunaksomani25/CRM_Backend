const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    rules: [
      {
        field: { type: String, required: true },       
        operator: { type: String, required: true },    
        value: { type: mongoose.Schema.Types.Mixed }, 
      },
    ],
    logicalOperator: { type: String, default: "AND" }, 
    audienceCount: { type: Number, default: 0 },       
  },
  { timestamps: true }
);

module.exports = mongoose.model("Segment", segmentSchema);
