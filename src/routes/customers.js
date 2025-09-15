const express = require("express");
const router = express.Router();
const apiKeyAuth = require("../middleware/apiKeyAuth");
const ensureAuth = require("../middleware/ensureAuth");
const { addCustomer, getCustomers } = require("../controllers/customerController");
router.use(apiKeyAuth, ensureAuth);
router.post("/", addCustomer);
router.get("/", getCustomers);

module.exports = router;
