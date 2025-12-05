// Simple authentication middleware
// In production, use proper JWT or session-based authentication

const authenticateUser = (req, res, next) => {
  // Get wallet address from header
  const walletAddress = req.headers["x-wallet-address"];
  const userRole = req.headers["x-user-role"];

  if (!walletAddress) {
    return res.status(401).json({
      success: false,
      message: "Wallet address required",
    });
  }

  // Attach user info to request
  req.user = {
    address: walletAddress,
    isAdmin: userRole === "admin",
    isOrganizer: userRole === "organizer" || userRole === "admin",
    isIssuer: userRole === "issuer" || userRole === "admin",
    isStudent: userRole === "student" || !userRole,
  };

  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

const requireOrganizer = (req, res, next) => {
  if (!req.user?.isOrganizer) {
    return res.status(403).json({
      success: false,
      message: "Organizer access required",
    });
  }
  next();
};

module.exports = {
  authenticateUser,
  requireAdmin,
  requireOrganizer,
};
