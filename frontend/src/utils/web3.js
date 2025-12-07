import { ethers } from "ethers";
import RewardTokenABI from "../contracts/RewardToken.sol/RewardToken.json";
import CredentialNFTABI from "../contracts/CredentialNFT.sol/CredentialNFT.json";
import RewardSystemABI from "../contracts/RewardSystem.sol/RewardSystem.json";

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {
      rewardToken: null,
      credentialNFT: null,
      rewardSystem: null,
    };
    this.currentAccount = null;
    this.chainId = null;
  }

  // Initialize Web3 and connect to MetaMask
  async init() {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed");
    }

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    await this.provider.send("eth_requestAccounts", []);

    this.signer = this.provider.getSigner();
    this.currentAccount = await this.signer.getAddress();

    const network = await this.provider.getNetwork();
    this.chainId = network.chainId;

    // Load contract addresses from environment
    const addresses = {
      rewardToken: import.meta.env.VITE_REWARD_TOKEN_ADDRESS,
      credentialNFT: import.meta.env.VITE_CREDENTIAL_NFT_ADDRESS,
      rewardSystem: import.meta.env.VITE_REWARD_SYSTEM_ADDRESS,
    };

    // Initialize contracts
    this.contracts.rewardToken = new ethers.Contract(
      addresses.rewardToken,
      RewardTokenABI.abi,
      this.signer
    );

    this.contracts.credentialNFT = new ethers.Contract(
      addresses.credentialNFT,
      CredentialNFTABI.abi,
      this.signer
    );

    this.contracts.rewardSystem = new ethers.Contract(
      addresses.rewardSystem,
      RewardSystemABI.abi,
      this.signer
    );

    // Listen for account changes
    window.ethereum.on("accountsChanged", (accounts) => {
      this.currentAccount = accounts[0];
      window.location.reload();
    });

    // Listen for chain changes
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    return this.currentAccount;
  }

  // Get current account
  getCurrentAccount() {
    return this.currentAccount;
  }

  // Get network info
  async getNetwork() {
    const network = await this.provider.getNetwork();
    return {
      chainId: network.chainId,
      name: network.name,
    };
  }

  // Token functions
  async getTokenBalance(address = this.currentAccount) {
    try {
      const balance = await this.contracts.rewardToken.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  async transferTokens(to, amount) {
    try {
      const amountWei = ethers.utils.parseEther(amount.toString());
      const tx = await this.contracts.rewardToken.transfer(to, amountWei);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Error transferring tokens:", error);
      throw error;
    }
  }

  // Credential functions
  async getCredentials(address = this.currentAccount) {
    try {
      const tokenIds = await this.contracts.credentialNFT.getOwnerCredentials(
        address
      );
      const credentials = [];

      for (let tokenId of tokenIds) {
        const cred = await this.contracts.credentialNFT.getCredential(tokenId);
        credentials.push({
          id: tokenId.toString(),
          type: cred.credentialType,
          title: cred.title,
          description: cred.description,
          issuer: cred.issuer,
          issuedAt: new Date(cred.issuedAt.toNumber() * 1000).toISOString(),
          revoked: cred.revoked,
          metadataURI: cred.metadataURI,
        });
      }

      return credentials;
    } catch (error) {
      console.error("Error getting credentials:", error);
      throw error;
    }
  }

  async verifyCredential(tokenId, address) {
    try {
      return await this.contracts.credentialNFT.verifyCredential(
        tokenId,
        address
      );
    } catch (error) {
      console.error("Error verifying credential:", error);
      throw error;
    }
  }

  // Event functions
  async createEvent(eventData) {
    try {
      const tx = await this.contracts.rewardSystem.createEvent(
        eventData.name,
        eventData.type,
        eventData.description,
        ethers.utils.parseEther(eventData.rewardAmount.toString()),
        eventData.issueCertificate
      );
      const receipt = await tx.wait();

      // Get event ID from logs
      const event = receipt.events?.find((e) => e.event === "EventCreated");
      return event?.args?.eventId.toString();
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async getEvent(eventId) {
    try {
      const event = await this.contracts.rewardSystem.getEvent(eventId);
      return {
        id: event.id.toString(),
        name: event.name,
        type: event.eventType,
        description: event.description,
        organizer: event.organizer,
        rewardAmount: ethers.utils.formatEther(event.rewardAmount),
        issueCertificate: event.issueCertificate,
        createdAt: new Date(event.createdAt.toNumber() * 1000).toISOString(),
        active: event.active,
      };
    } catch (error) {
      console.error("Error getting event:", error);
      throw error;
    }
  }

  async getAllEvents() {
    try {
      const totalEvents = await this.contracts.rewardSystem.getTotalEvents();
      const events = [];

      for (let i = 1; i <= totalEvents.toNumber(); i++) {
        const event = await this.getEvent(i);
        events.push(event);
      }

      return events;
    } catch (error) {
      console.error("Error getting all events:", error);
      throw error;
    }
  }

  async recordAttendance(eventId, studentAddress) {
    try {
      const tx = await this.contracts.rewardSystem.recordAttendance(
        eventId,
        studentAddress
      );
      const receipt = await tx.wait();

      const event = receipt.events?.find(
        (e) => e.event === "AttendanceRecorded"
      );
      return {
        tokensAwarded: ethers.utils.formatEther(
          event?.args?.tokensAwarded || 0
        ),
        credentialId: event?.args?.credentialId.toString(),
      };
    } catch (error) {
      console.error("Error recording attendance:", error);
      throw error;
    }
  }

  async recordMultipleAttendance(eventId, studentAddresses) {
    try {
      const tx = await this.contracts.rewardSystem.recordMultipleAttendance(
        eventId,
        studentAddresses
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Error recording multiple attendance:", error);
      throw error;
    }
  }

  async closeEvent(eventId) {
    try {
      const tx = await this.contracts.rewardSystem.closeEvent(eventId);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Error closing event:", error);
      throw error;
    }
  }

  // Student data
  async getStudentRecord(address = this.currentAccount) {
    try {
      const record = await this.contracts.rewardSystem.getStudentRecord(
        address
      );
      return {
        totalTokens: ethers.utils.formatEther(record.totalTokens),
        totalEvents: record.totalEvents.toString(),
        eventIds: record.eventIds.map((id) => id.toString()),
      };
    } catch (error) {
      console.error("Error getting student record:", error);
      throw error;
    }
  }

  async getDashboardData(address = this.currentAccount) {
    try {
      const [balance, credentials, studentRecord] = await Promise.all([
        this.getTokenBalance(address),
        this.getCredentials(address),
        this.getStudentRecord(address),
      ]);

      return {
        address,
        totalTokens: parseFloat(balance),
        credentials: credentials.length,
        credentialsList: credentials,
        totalEvents: parseInt(studentRecord.totalEvents),
        eventIds: studentRecord.eventIds,
      };
    } catch (error) {
      console.error("Error getting dashboard data:", error);
      throw error;
    }
  }

  // Role management
  async hasRole(role, address = this.currentAccount) {
    try {
      const roleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(role));
      return await this.contracts.rewardSystem.hasRole(roleHash, address);
    } catch (error) {
      console.error("Error checking role:", error);
      return false;
    }
  }

  // async isAdmin(address = this.currentAccount) {
  //   try {
  //     // Check both ADMIN_ROLE and DEFAULT_ADMIN_ROLE
  //     const adminRole = await this.hasRole("ADMIN_ROLE", address);
  //     const defaultAdminRole = await this.contracts.rewardSystem.hasRole(
  //       "0x0000000000000000000000000000000000000000000000000000000000000000",
  //       address
  //     );
  //     return adminRole || defaultAdminRole;
  //   } catch (error) {
  //     console.error("Error checking admin role:", error);
  //     return false;
  //   }
  // }
  async isAdmin(address = this.currentAccount) {
    try {
      const adminRole = await this.hasRole("ADMIN_ROLE", address);
      const defaultAdminRole = await this.contracts.rewardSystem.hasRole(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        address
      );
      return adminRole || defaultAdminRole;
    } catch (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
  }
  async isOrganizer(address = this.currentAccount) {
    try {
      const isOrg = await this.hasRole("ORGANIZER_ROLE", address);
      const isAdm = await this.isAdmin(address);
      return isOrg || isAdm; // Admins are also organizers
    } catch (error) {
      console.error("Error checking organizer role:", error);
      return false;
    }
  }

  async addOrganizer(address) {
    try {
      const tx = await this.contracts.rewardSystem.addOrganizer(address);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Error adding organizer:", error);
      throw error;
    }
  }
}

export const web3Service = new Web3Service();
export default web3Service;
