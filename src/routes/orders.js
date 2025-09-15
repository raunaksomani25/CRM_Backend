const express = require("express");
const router = express.Router();
const ensureAuth = require("../middleware/ensureAuth");
const apiKeyAuth = require("../middleware/apiKeyAuth");
const { addOrder, getOrders } = require("../controllers/orderController");
router.use(apiKeyAuth, ensureAuth);
router.post("/", addOrder);

router.get("/", getOrders);

module.exports = router;
