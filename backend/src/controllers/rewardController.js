const blockchain = require("../config/blockchain");

// Get token balance
const getBalance = async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await blockchain.getTokenBalance(address);

    res.json({
      success: true,
      address,
      balance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Issue direct reward
const issueReward = async (req, res) => {
  try {
    const { recipient, amount, reason } = req.body;
    const issuer = req.user?.address;

    if (!issuer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if issuer is admin (simplified - in production use proper role check)
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can issue direct rewards",
      });
    }

    const result = await blockchain.mintTokens(recipient, amount);

    res.json({
      success: true,
      message: "Reward issued successfully",
      recipient,
      amount,
      reason,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Transfer tokens
const transferTokens = async (req, res) => {
  try {
    const { to, amount } = req.body;
    const from = req.user?.address;

    if (!from) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await blockchain.transferTokens(from, to, amount);

    res.json({
      success: true,
      message: "Tokens transferred successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await blockchain.getLeaderboard(limit);

    res.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getBalance,
  issueReward,
  transferTokens,
  getLeaderboard,
};
