const express = require("express");
const passport = require("passport");
const router = express.Router();
require("dotenv").config();
const FRONTEND_URL = process.env.FRONTEND_URL

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/landing`);
  }
);


module.exports = router;
