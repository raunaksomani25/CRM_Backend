const express = require("express");
const ensureAuth = require("../middleware/ensureAuth");
const router = express.Router();

router.get("/me", ensureAuth, (req, res) => {
  res.json({
    id: req.user.id,
    displayName: req.user.displayName,
    emails: req.user.emails,
  });
});

module.exports = router;
