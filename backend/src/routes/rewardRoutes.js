const express = require("express");
const router = express.Router();
const rewardController = require("../controllers/rewardController");
const { authenticateUser, requireAdmin } = require("../middleware/auth");

// Get token balance
router.get("/balance/:address", rewardController.getBalance);

// Issue direct reward (admin only)
router.post(
  "/issue",
  authenticateUser,
  requireAdmin,
  rewardController.issueReward
);

// Transfer tokens
router.post("/transfer", authenticateUser, rewardController.transferTokens);

// Get leaderboard
router.get("/leaderboard", rewardController.getLeaderboard);

module.exports = router;
