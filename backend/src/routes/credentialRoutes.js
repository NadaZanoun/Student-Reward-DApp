const express = require("express");
const router = express.Router();
const credentialController = require("../controllers/credentialController");
const { authenticateUser } = require("../middleware/auth");

// Get credentials for address
router.get("/:address", credentialController.getCredentials);

// Issue credential
router.post("/issue", authenticateUser, credentialController.issueCredential);

// Verify credential
router.get("/verify/:tokenId/:address", credentialController.verifyCredential);

module.exports = router;
