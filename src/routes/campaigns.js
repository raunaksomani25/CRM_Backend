const express = require("express");
const router = express.Router();
const ensureAuth = require("../middleware/ensureAuth");
const apiKeyAuth = require("../middleware/apiKeyAuth");
const { createCampaign, getCampaigns,getCampaignLogs } = require("../controllers/campaignController");

router.use(apiKeyAuth, ensureAuth);

router.post("/", createCampaign);

router.get("/", getCampaigns);

router.get("/:campaignId/logs", getCampaignLogs);
module.exports = router;
