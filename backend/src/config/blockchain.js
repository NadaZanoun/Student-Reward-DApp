// Blockchain configuration and smart contract interface
// This simulates blockchain interaction for the Python contracts

class BlockchainInterface {
  constructor() {
    // In-memory storage simulating blockchain state
    this.contracts = {
      rewardToken: null,
      credentialNFT: null,
      rewardSystem: null,
    };

    this.currentAccount = null;
  }

  // Initialize contracts (simulated deployment)
  async initializeContracts(ownerAddress) {
    try {
      // Simulate contract initialization
      this.contracts.rewardToken = {
        address: "0xRewardToken...",
        owner: ownerAddress,
        balances: {},
        totalSupply: 0,
      };

      this.contracts.credentialNFT = {
        address: "0xCredentialNFT...",
        owner: ownerAddress,
        tokens: {},
        counter: 0,
      };

      this.contracts.rewardSystem = {
        address: "0xRewardSystem...",
        owner: ownerAddress,
        events: {},
        eventCounter: 0,
      };

      return this.contracts;
    } catch (error) {
      throw new Error(`Contract initialization failed: ${error.message}`);
    }
  }

  // Set current connected account
  setCurrentAccount(account) {
    this.currentAccount = account;
  }

  getCurrentAccount() {
    return this.currentAccount;
  }

  // Token operations
  async getTokenBalance(address) {
    return this.contracts.rewardToken.balances[address] || 0;
  }

  async mintTokens(recipient, amount) {
    if (!this.contracts.rewardToken.balances[recipient]) {
      this.contracts.rewardToken.balances[recipient] = 0;
    }
    this.contracts.rewardToken.balances[recipient] += amount;
    this.contracts.rewardToken.totalSupply += amount;
    return { success: true, amount };
  }

  async transferTokens(from, to, amount) {
    const balance = this.contracts.rewardToken.balances[from] || 0;
    if (balance < amount) {
      throw new Error("Insufficient balance");
    }

    this.contracts.rewardToken.balances[from] -= amount;
    if (!this.contracts.rewardToken.balances[to]) {
      this.contracts.rewardToken.balances[to] = 0;
    }
    this.contracts.rewardToken.balances[to] += amount;

    return { success: true, from, to, amount };
  }

  // Credential operations
  async mintCredential(recipient, metadata) {
    this.contracts.credentialNFT.counter++;
    const tokenId = this.contracts.credentialNFT.counter;

    this.contracts.credentialNFT.tokens[tokenId] = {
      id: tokenId,
      owner: recipient,
      metadata,
      issuedAt: new Date().toISOString(),
    };

    return { success: true, tokenId };
  }

  async getCredentials(address) {
    const credentials = [];
    for (const [tokenId, token] of Object.entries(
      this.contracts.credentialNFT.tokens
    )) {
      if (token.owner === address) {
        credentials.push({ tokenId: parseInt(tokenId), ...token });
      }
    }
    return credentials;
  }

  async verifyCredential(tokenId, address) {
    const token = this.contracts.credentialNFT.tokens[tokenId];
    return token && token.owner === address;
  }

  // Event operations
  async createEvent(eventData) {
    this.contracts.rewardSystem.eventCounter++;
    const eventId = this.contracts.rewardSystem.eventCounter;

    this.contracts.rewardSystem.events[eventId] = {
      id: eventId,
      ...eventData,
      participants: [],
      createdAt: new Date().toISOString(),
      active: true,
    };

    return { success: true, eventId };
  }

  async recordAttendance(eventId, studentAddress) {
    const event = this.contracts.rewardSystem.events[eventId];
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.participants.includes(studentAddress)) {
      throw new Error("Student already recorded");
    }

    event.participants.push(studentAddress);

    // Issue tokens
    const tokenResult = await this.mintTokens(
      studentAddress,
      event.rewardAmount
    );

    // Issue credential if configured
    let credentialId = null;
    if (event.issueCertificate) {
      const credResult = await this.mintCredential(studentAddress, {
        eventId,
        eventName: event.name,
        eventType: event.type,
        type: "certificate",
      });
      credentialId = credResult.tokenId;
    }

    return {
      success: true,
      tokensEarned: tokenResult.amount,
      credentialId,
    };
  }

  async getEvent(eventId) {
    return this.contracts.rewardSystem.events[eventId];
  }

  async getActiveEvents() {
    return Object.values(this.contracts.rewardSystem.events).filter(
      (e) => e.active
    );
  }

  async getAllEvents() {
    return Object.values(this.contracts.rewardSystem.events);
  }

  // Student data
  async getStudentSummary(address) {
    const balance = await this.getTokenBalance(address);
    const credentials = await this.getCredentials(address);

    // Get event history
    const eventHistory = [];
    for (const event of Object.values(this.contracts.rewardSystem.events)) {
      if (event.participants.includes(address)) {
        eventHistory.push({
          eventId: event.id,
          eventName: event.name,
          eventType: event.type,
          tokensEarned: event.rewardAmount,
          timestamp: event.createdAt,
        });
      }
    }

    return {
      address,
      totalTokens: balance,
      credentials: credentials.length,
      credentialsList: credentials,
      eventHistory,
      totalEvents: eventHistory.length,
    };
  }

  // Leaderboard
  async getLeaderboard(limit = 10) {
    const leaderboard = Object.entries(this.contracts.rewardToken.balances)
      .map(([address, tokens]) => ({ address, tokens }))
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, limit);

    return leaderboard;
  }
}

// Export singleton instance
const blockchain = new BlockchainInterface();

module.exports = blockchain;
