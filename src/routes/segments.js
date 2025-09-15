const express = require("express");
const router = express.Router();
const apiKeyAuth = require("../middleware/apiKeyAuth");
const ensureAuth = require("../middleware/ensureAuth");
const {
  previewSegment,
  saveSegment,
  getSegments,
  getSegmentMembers
} = require("../controllers/segmentController");

router.use(apiKeyAuth, ensureAuth);

router.post("/preview", previewSegment);

router.post("/", saveSegment);

router.get("/", getSegments);

router.post("/members", getSegmentMembers);
module.exports = router;
