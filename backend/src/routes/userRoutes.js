const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateUser, requireOrganizer } = require("../middleware/auth");

// Get dashboard data
router.get("/dashboard", authenticateUser, userController.getDashboard);
router.get("/dashboard/:address", userController.getDashboard);

// Event management
router.post(
  "/events",
  authenticateUser,
  requireOrganizer,
  userController.createEvent
);
router.get("/events", userController.getEvents);
router.get("/events/:eventId", userController.getEvent);

// Record attendance
router.post(
  "/attendance",
  authenticateUser,
  requireOrganizer,
  userController.recordAttendance
);

module.exports = router;
