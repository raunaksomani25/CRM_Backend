const Order = require("../models/Order");
const Customer = require("../models/Customer");

exports.addOrder = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    const { externalOrderId, customerExternalId, amount } = req.body;
    const customer = await Customer.findOne({ externalId: customerExternalId });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const order = new Order({ externalOrderId, customerExternalId, amount: Number(amount) });
    await order.save();
    customer.totalSpend += Number(amount);
    customer.visits += 1;
    customer.lastOrderDate = new Date();
    await customer.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
