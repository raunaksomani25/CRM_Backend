const Segment = require("../models/Segment");
const Customer = require("../models/Customer");
const CommunicationLog = require("../models/CommunicationLog");
const Campaign = require("../models/Campaign");

function buildQuery(rules, logicalOperator) {
  const mongoRules = rules.map((r) => {
    let condition;
    switch (r.operator) {
      case ">":
        condition = { [r.field]: { $gt: r.value } };
        break;
      case "<":
        condition = { [r.field]: { $lt: r.value } };
        break;
      case "==":
        condition = { [r.field]: r.value };
        break;
      default:
        condition = {};
        break;
    }
    return condition;
  });

  if (logicalOperator === "AND") return { $and: mongoRules };
  else return { $or: mongoRules };
}

exports.previewSegment = async (req, res) => {
  try {
    const { rules, logicalOperator } = req.body;
    const query = buildQuery(rules, logicalOperator);
    const audienceCount = await Customer.countDocuments(query);
    res.json({ audienceCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.saveSegment = async (req, res) => {
  try {
    const { name, description, rules, logicalOperator } = req.body;

    const segment = new Segment({ name, description, rules, logicalOperator });
    const query = buildQuery(rules, logicalOperator);
    const customers = await Customer.find(query);

    segment.audienceCount = customers.length;
    await segment.save();

    const campaign = new Campaign({
      name: `Campaign for ${segment.name}`,
      segment: segment._id,
      message: "Hi [NAME], here’s 10% off on your next order!",
      sentCount: 0,
      failedCount: 0,
      deliveryLog: [],
    });
    await campaign.save();

    for (const customer of customers) {
      const personalizedMessage = `Hi ${customer.name}, here is 10% off on your next order!`;
      const success = Math.random() < 0.9 ? "SENT" : "FAILED";

      const log = new CommunicationLog({
        customer: customer._id,
        segment: segment._id,
        campaign: campaign._id,
        message: personalizedMessage,
        status: success,
      });
      await log.save();
      campaign.deliveryLog.push({ customerId: customer._id,message: personalizedMessage, status: success });
      if (success === "SENT") campaign.sentCount += 1;
      else campaign.failedCount += 1;
    }
    await campaign.save();

    res.status(201).json(segment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSegments = async (req, res) => {
  try {
    const segments = await Segment.find().sort({ createdAt: -1 });
    res.json(segments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSegmentMembers = async (req, res) => {
  try {
    const { rules, logicalOperator } = req.body;
    const query = buildQuery(rules, logicalOperator);
    const customers = await Customer.find(query).select(
      "name email externalId totalSpend visits lastOrderDate"
    );
    res.json(customers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
