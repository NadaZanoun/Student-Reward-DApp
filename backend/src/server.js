const express = require("express");
const cors = require("cors");
const blockchain = require("./config/blockchain");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const rewardRoutes = require("./routes/rewardRoutes");
const credentialRoutes = require("./routes/credentialRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize blockchain
const initBlockchain = async () => {
  try {
    const ownerAddress = process.env.OWNER_ADDRESS || "0xOwner123456789";
    await blockchain.initializeContracts(ownerAddress);
    console.log("✓ Blockchain contracts initialized");
    console.log(`  Owner: ${ownerAddress}`);
  } catch (error) {
    console.error("Failed to initialize blockchain:", error);
  }
};

// Routes
app.use("/api/rewards", rewardRoutes);
app.use("/api/credentials", credentialRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Student Rewards API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const startServer = async () => {
  await initBlockchain();

  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   Student Rewards DApp - Backend API      ║
╚════════════════════════════════════════════╝

🚀 Server running on port ${PORT}
🌐 API endpoint: http://localhost:${PORT}/api
📊 Health check: http://localhost:${PORT}/api/health

Available routes:
  - POST   /api/rewards/issue
  - GET    /api/rewards/balance/:address
  - POST   /api/rewards/transfer
  - GET    /api/rewards/leaderboard
  - GET    /api/credentials/:address
  - POST   /api/credentials/issue
  - GET    /api/credentials/verify/:tokenId/:address
  - GET    /api/users/dashboard
  - POST   /api/users/events
  - GET    /api/users/events
  - POST   /api/users/attendance
    `);
  });
};

startServer().catch(console.error);

module.exports = app;
