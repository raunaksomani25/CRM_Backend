const CommunicationLog = require("../models/CommunicationLog");
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { logId, status } = req.body;
    const log = await CommunicationLog.findById(logId);
    if (!log) return res.status(404).json({ error: "Log not found" });

    log.status = status;
    await log.save();

    res.json({ success: true, log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
