# Student Rewards DApp - Fully Decentralized

A fully decentralized application for rewarding students with blockchain-verified credentials. Uses Solidity smart contracts, MetaMask integration, and runs entirely on-chain with no backend server.

## 🎯 Overview

This DApp is **completely decentralized**:

- ✅ All logic runs in Solidity smart contracts
- ✅ No backend server required
- ✅ Direct MetaMask integration
- ✅ Admin only marks attendance via smart contracts
- ✅ Everything stored on-chain (Sepolia testnet)

## 🏗️ Project Structure

```
student-rewards-dapp/
├── contracts/                    # Solidity Smart Contracts
│   ├── contracts/
│   │   ├── RewardToken.sol      # ERC-20 token
│   │   ├── CredentialNFT.sol    # Soulbound NFT
│   │   └── RewardSystem.sol     # Main system
│   ├── scripts/
│   │   └── deploy.js            # Deployment script
│   ├── hardhat.config.js
│   └── package.json
└── frontend/                     # React Frontend (Web3 enabled)
    ├── src/
    │   ├── components/
    │   ├── utils/
    │   │   └── web3Service.js   # Web3 integration
    │   └── App.jsx
    └── package.json
```

## 🚀 Complete Setup Guide

### Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension
3. **Sepolia ETH** (for gas fees)

### Step 1: Clone and Install

```bash
# Create project directory
mkdir student-rewards-dapp
cd student-rewards-dapp

# Create subdirectories
mkdir contracts frontend
```

### Step 2: Setup Smart Contracts

```bash
cd contracts

# Initialize npm and install dependencies
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts dotenv

# Initialize Hardhat
npx hardhat

# Select: Create a JavaScript project
```

**Create the contract files:**

- Copy `RewardToken.sol` to `contracts/RewardToken.sol`
- Copy `CredentialNFT.sol` to `contracts/CredentialNFT.sol`
- Copy `RewardSystem.sol` to `contracts/RewardSystem.sol`
- Copy `deploy.js` to `scripts/deploy.js`
- Copy `hardhat.config.js` to root

**Configure environment:**

```bash
# Create .env file
cp .env.example .env
```

Edit `.env`:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_metamask_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**Get your requirements:**

1. **Alchemy/Infura RPC URL:**

   - Go to [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)
   - Create free account
   - Create new app on Sepolia
   - Copy HTTPS URL

2. **MetaMask Private Key:**

   - Open MetaMask
   - Click account menu → Account Details → Export Private Key
   - ⚠️ **NEVER share or commit this key!**

3. **Etherscan API Key (Optional):**
   - Go to [Etherscan](https://etherscan.io/)
   - Create account
   - API Keys → Add → Copy key

### Step 3: Get Sepolia Test ETH

You need Sepolia ETH to deploy contracts:

1. **Option 1: Alchemy Faucet**

   - Visit: https://sepoliafaucet.com/
   - Login with Alchemy account
   - Enter your MetaMask address
   - Receive 0.5 Sepolia ETH

2. **Option 2: Infura Faucet**

   - Visit: https://www.infura.io/faucet/sepolia
   - Enter address

3. **Option 3: QuickNode Faucet**
   - Visit: https://faucet.quicknode.com/ethereum/sepolia

### Step 4: Compile and Deploy Contracts

```bash
# Compile contracts
npx hardhat compile

# Test locally first (optional)
npx hardhat node
# In another terminal:
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

**Save the contract addresses from the output!** You'll need them for the frontend.

Example output:

```
✅ RewardToken deployed to: 0x123...
✅ CredentialNFT deployed to: 0x456...
✅ RewardSystem deployed to: 0x789...
```

### Step 5: Verify Contracts on Etherscan (Optional)

```bash
npx hardhat verify --network sepolia REWARD_TOKEN_ADDRESS
npx hardhat verify --network sepolia CREDENTIAL_NFT_ADDRESS
npx hardhat verify --network sepolia REWARD_SYSTEM_ADDRESS TOKEN_ADDRESS NFT_ADDRESS
```

### Step 6: Setup Frontend

```bash
cd ../frontend

# Initialize npm and install dependencies
npm init -y
npm install react react-dom ethers@5.7.2 lucide-react
npm install --save-dev vite @vitejs/plugin-react tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

**Create all frontend files:**

- Copy all component files to `src/components/`
- Copy `web3Service.js` to `src/utils/`
- Copy `App.jsx` to `src/`
- Copy configuration files

**Create `.env` file:**

```bash
cp .env.example .env
```

Edit `.env` with your deployed contract addresses:

```env
VITE_REWARD_TOKEN_ADDRESS=0xYourRewardTokenAddress
VITE_CREDENTIAL_NFT_ADDRESS=0xYourCredentialNFTAddress
VITE_REWARD_SYSTEM_ADDRESS=0xYourRewardSystemAddress
VITE_CHAIN_ID=11155111
VITE_NETWORK_NAME=sepolia
```

### Step 7: Copy Contract ABIs

After compiling contracts, copy the ABI files:

```bash
# From contracts directory
cp artifacts/contracts/RewardToken.sol/RewardToken.json ../frontend/src/contracts/
cp artifacts/contracts/CredentialNFT.sol/CredentialNFT.json ../frontend/src/contracts/
cp artifacts/contracts/RewardSystem.sol/RewardSystem.json ../frontend/src/contracts/
```

Create `frontend/src/contracts/` directory if it doesn't exist.

### Step 8: Run the DApp

```bash
# Start frontend
npm run dev
```

Visit: `http://localhost:3000`

## 📱 Using the DApp

### For Students

1. **Connect MetaMask**

   - Click "Connect MetaMask"
   - Approve connection
   - Switch to Sepolia network (will prompt automatically)

2. **View Dashboard**

   - See your SRT token balance
   - View earned credentials (NFT badges)
   - Check event participation history

3. **Share Your Address**
   - Give your wallet address to organizers to receive rewards

### For Admins/Organizers

1. **Get Admin Role**

   - Contract deployer is automatically admin
   - Admin can add other organizers

2. **Create Events**

   - Click "Create Event"
   - Set event details and reward amount
   - Choose whether to issue certificate
   - Confirm transaction in MetaMask

3. **Mark Attendance**
   - **Single Student:** Use "Single Attendance"
   - **Multiple Students:** Use "Bulk Attendance"
   - Enter student wallet addresses
   - Confirm transaction
   - Tokens and certificates are automatically issued!

## 🔐 Adding Organizers (Admin Only)

```javascript
// In browser console after connecting as admin:
const rewardSystem = new ethers.Contract(
  REWARD_SYSTEM_ADDRESS,
  REWARD_SYSTEM_ABI,
  signer
);

await rewardSystem.addOrganizer("0xOrganizerAddress");
```

Or use Etherscan's Write Contract feature.

## 🧪 Testing on Sepolia

### Test Flow:

1. **As Admin:**

   ```
   - Create event "Test Workshop"
   - Reward: 50 SRT
   - Issue certificate: Yes
   ```

2. **Record Attendance:**

   ```
   - Enter student address
   - Confirm transaction
   - Wait for confirmation (~15-20 seconds)
   ```

3. **As Student:**

   ```
   - Connect with student wallet
   - Check dashboard
   - See 50 SRT tokens
   - See certificate NFT
   ```

4. **Verify on Blockchain:**
   - View transaction on [Sepolia Etherscan](https://sepolia.etherscan.io/)
   - Check contract events
   - Verify token balance

## 📊 Smart Contract Functions

### RewardToken (ERC-20)

- `balanceOf(address)` - Check token balance
- `transfer(to, amount)` - Transfer tokens
- `mint(to, amount, reason)` - Mint tokens (admin only)

### CredentialNFT (Soulbound)

- `getOwnerCredentials(address)` - Get all credentials
- `getCredential(tokenId)` - Get credential details
- `verifyCredential(tokenId, address)` - Verify ownership
- `issueCredential(...)` - Issue new credential (admin only)

### RewardSystem

- `createEvent(...)` - Create new event
- `recordAttendance(eventId, student)` - Mark single attendance
- `recordMultipleAttendance(eventId, students[])` - Bulk attendance
- `getEvent(eventId)` - Get event details
- `getStudentRecord(address)` - Get student stats

## 🔍 Viewing on Etherscan

1. Go to [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Search for your contract addresses
3. View:
   - All transactions
   - Token transfers
   - NFT mints
   - Event logs
   - Contract code (if verified)

## 💡 Key Features

### Decentralization

- **No Backend:** Everything runs on-chain
- **No Database:** Blockchain is the database
- **Censorship Resistant:** Can't be taken down
- **Transparent:** All actions visible on-chain

### Security

- **Access Control:** Role-based permissions
- **Soulbound Tokens:** Credentials can't be transferred
- **Immutable Records:** Can't alter past achievements
- **Verifiable:** Anyone can verify credentials

### Gas Optimization

- Batch attendance recording
- Efficient storage patterns
- Optimized contract compilation

## 🐛 Troubleshooting

### MetaMask Issues

**"Wrong Network"**

```
- Open MetaMask
- Click network dropdown
- Select "Sepolia test network"
- If not visible, enable "Show test networks" in settings
```

**"Insufficient Funds"**

```
- Get more Sepolia ETH from faucet
- Each transaction costs ~0.001-0.005 ETH
```

**"Transaction Failed"**

```
- Check you have enough gas
- Try increasing gas limit
- Ensure you have proper role permissions
```

### Contract Issues

**"Not Authorized"**

```
- Check your role with hasRole()
- Admin must grant ORGANIZER_ROLE
- Use addOrganizer() function
```

**"Student Already Recorded"**

```
- Can't mark same student twice for same event
- Check attendance with hasAttended()
```

### Frontend Issues

**"Cannot Read Properties of Undefined"**

```
- Ensure contract addresses in .env are correct
- Check ABI files are copied to src/contracts/
- Verify network is Sepolia (chainId: 11155111)
```

**"Contract Not Deployed"**

```
- Verify you're on Sepolia network
- Check contract addresses are correct
- Ensure contracts are actually deployed
```

## 📈 Future Enhancements

- IPFS integration for credential metadata
- Reputation system based on token holdings
- Event categories and filtering
- Student profiles and portfolios
- Mobile app with WalletConnect
- DAO governance for system parameters

## 🔗 Useful Links

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Alchemy Dashboard](https://dashboard.alchemy.com/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/v5/)
- [MetaMask Documentation](https://docs.metamask.io/)

## 📄 License

MIT License - Educational purposes

## 🤝 Support

For issues or questions:

1. Check console for errors
2. Verify transaction on Etherscan
3. Check contract events
4. Review troubleshooting section

---

**🎉 You now have a fully decentralized student rewards system running on Sepolia testnet!**
