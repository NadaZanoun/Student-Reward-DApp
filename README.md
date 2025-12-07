# Student Rewards DApp

A blockchain-based system for managing student rewards and credentials using Ethereum smart contracts.

## Requirements

- Node.js (v16 or higher)
- MetaMask browser extension
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

2. Install Hardhat dependencies:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

3. Install frontend dependencies:

```bash
npm install ethers@5.7.0 lucide-react
```

## Running the Application

### Step 1: Start Local Blockchain

Open a terminal and run:

```bash
npx hardhat node
```

Keep this terminal open. It will show 20 test accounts with their private keys.

### Step 2: Deploy Smart Contracts

In a new terminal, deploy the contracts:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Copy the three contract addresses from the output.

### Step 3: Configure Environment

Create a `.env` file in the root directory:

```
VITE_REWARD_TOKEN_ADDRESS=<RewardToken address>
VITE_CREDENTIAL_NFT_ADDRESS=<CredentialNFT address>
VITE_REWARD_SYSTEM_ADDRESS=<RewardSystem address>
```

### Step 4: Start Frontend

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Step 5: Setup MetaMask

1. Add Hardhat Network to MetaMask:

   - Network Name: Localhost
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency: ETH

2. Import accounts:
   - Account #0 (Admin): Copy private key from hardhat terminal
   - Account #1 (Student): Copy private key from hardhat terminal

## Demo Workflow

### As Admin (Account #0):

1. Connect wallet with Account #0
2. Go to Admin Panel
3. Create new event (e.g., "Blockchain Workshop")
4. Set reward amount (50 SRT) and enable certificate
5. Copy a student address from MetaMask (Account #1)
6. Record attendance for that student

### As Student (Account #1):

1. Switch to Account #1 in MetaMask
2. Refresh page and connect wallet
3. View dashboard showing:
   - Earned tokens
   - NFT certificate
   - Event history

## Features

- ERC20 reward tokens (SRT)
- ERC721 NFT certificates (soulbound)
- Role-based access control (Admin/Organizer)
- Event creation and management
- Attendance tracking
- Student dashboard

## Smart Contracts

- **RewardToken.sol**: ERC20 token for rewards
- **CredentialNFT.sol**: Soulbound NFT certificates
- **RewardSystem.sol**: Main system logic and access control

## Project Structure

```
/contracts          - Solidity smart contracts
/scripts           - Deployment scripts
/src
  /components      - React components
  /utils           - Web3 integration
/artifacts         - Compiled contracts
```

## Notes

This is a demonstration project running on a local blockchain. All data resets when restarting the hardhat node.
