const Campaign = require("../models/Campaign");
const Segment = require("../models/Segment");
const Customer = require("../models/Customer");
const CommunicationLog = require("../models/CommunicationLog");
async function sendMessage(customer, message) {
  const success = Math.random() < 0.9;
  return { customerId: customer._id, status: success ? "SENT" : "FAILED" };
}
function buildQuery(rules, logicalOperator) {
  const mongoRules = rules.map((r) => {
    switch (r.operator) {
      case ">":
        return { [r.field]: { $gt: r.value } };
      case "<":
        return { [r.field]: { $lt: r.value } };
      case "=":
        return { [r.field]: r.value };
      default:
        return {};
    }
  });

  if (logicalOperator === "AND") return { $and: mongoRules };
  else return { $or: mongoRules };
}
exports.createCampaign = async (req, res) => {
  try {
    const { name, segmentId, message } = req.body;

    const segment = await Segment.findById(segmentId);
    if (!segment) return res.status(404).json({ error: "Segment not found" });
    const query = buildQuery(segment.rules, segment.logicalOperator);
    const customers = await Customer.find(query);
    const deliveryLog = [];
    const campaign = new Campaign({
      name,
      segment: segment._id,
      message,
      audienceSize: customers.length,
      sentCount: 0,
      failedCount: 0,
      deliveryLog: [],
    });
    await campaign.save();
    for (const customer of customers) {
      const result = await sendMessage(customer, message);
      const log = new CommunicationLog({
        customer: customer._id,
        segment: segment._id,
        campaign: campaign._id,
        message: message.replace("[NAME]", customer.name), 
        status: result.status,
      });
      await log.save();

      deliveryLog.push({
        customerId: customer._id,
        status: result.status,
        timestamp: new Date(),
      });

      if (result.status === "SENT") campaign.sentCount += 1;
      else campaign.failedCount += 1;
    }

    campaign.deliveryLog = deliveryLog;
    await campaign.save();

    res.status(201).json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .sort({ createdAt: -1 }) // latest first
      .populate("segment", "name audienceSize");

    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

exports.getCampaignLogs = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const logs = await CommunicationLog.find({ campaign: campaignId })
      .populate("customer", "name externalId")
      .sort({ createdAt: -1 });

    if (!logs || logs.length === 0) {
      return res.status(404).json({ error: "No logs found for this campaign" });
    }

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch campaign logs" });
  }
};
