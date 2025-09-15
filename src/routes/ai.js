const express = require("express");
const router = express.Router();
const { generateMessages } = require("../controllers/aiController");
const apiKeyAuth = require("../middleware/apiKeyAuth");
const ensureAuth = require("../middleware/ensureAuth");

router.use(apiKeyAuth, ensureAuth);

router.post("/messages", generateMessages);

module.exports = router;
