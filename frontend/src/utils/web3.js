// Web3 utilities for frontend blockchain interaction
const API_URL = "http://localhost:5000/api";
import Web3 from "web3";

class Web3Service {
  constructor() {
    this.currentAccount = null;
    this.userRole = "student";
  }

  // Connect wallet (simulated)
  async connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        this.web3 = new Web3(window.ethereum);

        const accounts = await this.web3.eth.getAccounts();
        this.currentAccount = accounts[0];

        // Optional: listen for account changes
        window.ethereum.on("accountsChanged", (accounts) => {
          this.currentAccount = accounts[0] || null;
          console.log("Wallet changed:", this.currentAccount);
        });

        return this.currentAccount;
      } catch (err) {
        console.error("User rejected connection", err);
        throw err;
      }
    } else {
      alert("MetaMask not detected. Please install it.");
      throw new Error("MetaMask not detected");
    }
  }

  // Set user role
  setUserRole(role) {
    this.userRole = role;
  }

  getUserRole() {
    return this.userRole;
  }

  setCurrentAccount(address) {
    this.currentAccount = address;
  }

  getCurrentAccount() {
    return this.currentAccount;
  }

  // Helper to make authenticated requests
  async makeRequest(endpoint, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(this.currentAccount && {
        "x-wallet-address": this.currentAccount,
        "x-user-role": this.userRole,
      }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  // Rewards API
  async getBalance(address = this.currentAccount) {
    return this.makeRequest(`/rewards/balance/${address}`);
  }

  async issueReward(recipient, amount, reason) {
    return this.makeRequest("/rewards/issue", {
      method: "POST",
      body: JSON.stringify({ recipient, amount, reason }),
    });
  }

  async transferTokens(to, amount) {
    return this.makeRequest("/rewards/transfer", {
      method: "POST",
      body: JSON.stringify({ to, amount }),
    });
  }

  async getLeaderboard(limit = 10) {
    return this.makeRequest(`/rewards/leaderboard?limit=${limit}`);
  }

  // Credentials API
  async getCredentials(address = this.currentAccount) {
    return this.makeRequest(`/credentials/${address}`);
  }

  async issueCredential(recipient, type, title, description, metadata) {
    return this.makeRequest("/credentials/issue", {
      method: "POST",
      body: JSON.stringify({ recipient, type, title, description, metadata }),
    });
  }

  async verifyCredential(tokenId, address) {
    return this.makeRequest(`/credentials/verify/${tokenId}/${address}`);
  }

  // User API
  async getDashboard(address = this.currentAccount) {
    return this.makeRequest(
      address ? `/users/dashboard/${address}` : "/users/dashboard"
    );
  }

  async createEvent(eventData) {
    return this.makeRequest("/users/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  }

  async getEvents(activeOnly = false) {
    return this.makeRequest(`/users/events?active=${activeOnly}`);
  }

  async getEvent(eventId) {
    return this.makeRequest(`/users/events/${eventId}`);
  }

  async recordAttendance(eventId, studentAddress) {
    return this.makeRequest("/users/attendance", {
      method: "POST",
      body: JSON.stringify({ eventId, studentAddress }),
    });
  }
}

export const web3Service = new Web3Service();
export default web3Service;
