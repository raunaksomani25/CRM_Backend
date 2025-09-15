const express = require("express");
const router = express.Router();
const { updateDeliveryStatus } = require("../controllers/deliveryController");

router.post("/delivery-receipt", updateDeliveryStatus);

module.exports = router;
