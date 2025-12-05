const blockchain = require("../config/blockchain");

// Get student dashboard data
const getDashboard = async (req, res) => {
  try {
    const address = req.user?.address || req.params.address;

    if (!address) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const summary = await blockchain.getStudentSummary(address);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create event
const createEvent = async (req, res) => {
  try {
    const { name, type, description, rewardAmount, issueCertificate } =
      req.body;
    const organizer = req.user?.address;

    if (!organizer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if user can create events
    if (!req.user?.isAdmin && !req.user?.isOrganizer) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to create events",
      });
    }

    const result = await blockchain.createEvent({
      name,
      type,
      description,
      rewardAmount: parseInt(rewardAmount),
      issueCertificate: issueCertificate || false,
      organizer,
    });

    res.json({
      success: true,
      message: "Event created successfully",
      eventId: result.eventId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Record attendance
const recordAttendance = async (req, res) => {
  try {
    const { eventId, studentAddress } = req.body;
    const organizer = req.user?.address;

    if (!organizer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await blockchain.recordAttendance(
      parseInt(eventId),
      studentAddress
    );

    res.json({
      success: true,
      message: "Attendance recorded successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get event details
const getEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await blockchain.getEvent(parseInt(eventId));

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const activeOnly = req.query.active === "true";
    const events = activeOnly
      ? await blockchain.getActiveEvents()
      : await blockchain.getAllEvents();

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  createEvent,
  recordAttendance,
  getEvent,
  getEvents,
};
