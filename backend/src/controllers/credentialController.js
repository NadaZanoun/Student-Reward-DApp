const blockchain = require("../config/blockchain");

// Get credentials for address
const getCredentials = async (req, res) => {
  try {
    const { address } = req.params;
    const credentials = await blockchain.getCredentials(address);

    res.json({
      success: true,
      address,
      credentials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Issue credential
const issueCredential = async (req, res) => {
  try {
    const { recipient, type, title, description, metadata } = req.body;
    const issuer = req.user?.address;

    if (!issuer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if issuer has permission
    if (!req.user?.isAdmin && !req.user?.isIssuer) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to issue credentials",
      });
    }

    const credentialMetadata = {
      type,
      title,
      description,
      issuer,
      ...metadata,
    };

    const result = await blockchain.mintCredential(
      recipient,
      credentialMetadata
    );

    res.json({
      success: true,
      message: "Credential issued successfully",
      credentialId: result.tokenId,
      recipient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify credential
const verifyCredential = async (req, res) => {
  try {
    const { tokenId, address } = req.params;
    const isValid = await blockchain.verifyCredential(
      parseInt(tokenId),
      address
    );

    res.json({
      success: true,
      tokenId: parseInt(tokenId),
      address,
      isValid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCredentials,
  issueCredential,
  verifyCredential,
};
