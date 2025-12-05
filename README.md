# Student Rewards DApp

A decentralized application for rewarding students and issuing blockchain-verified credentials for their achievements in workshops, competitions, club events, and more.

## 📋 Features

### Core Functionality

- **ERC-20 Token System**: Student Reward Tokens (SRT) for achievements
- **Soulbound NFT Credentials**: Non-transferable certificates and badges
- **Student Dashboard**: View tokens, credentials, and event history
- **Leaderboard**: Competitive ranking based on token earnings
- **Admin/Organizer Panel**: Manage events, issue rewards, record attendance
- **Event Management**: Create and manage various types of events

### User Roles

- **Student**: Earn tokens, collect credentials, view dashboard
- **Event Organizer**: Create events, record attendance
- **Admin**: Full system access, issue direct rewards, manage all events

### Supported Event Types

- Workshop Attendance
- Competition Participation & Wins
- Hackathon Participation & Wins
- Club Contributions
- Volunteer Work

## 🏗️ Project Structure

```
student-rewards-dapp/
├── smart-contracts/          # Python-based smart contract logic
│   ├── contracts/
│   │   ├── RewardToken.py          # ERC-20 token contract
│   │   ├── CredentialNFT.py        # Soulbound NFT contract
│   │   └── RewardSystem.py         # Main reward management
│   └── scripts/
│       └── deploy.py               # Deployment script
├── backend/                  # Express.js API
│   └── src/
│       ├── config/
│       │   └── blockchain.js       # Blockchain interface
│       ├── controllers/            # API logic
│       ├── routes/                 # API routes
│       ├── middleware/             # Auth middleware
│       └── server.js               # Express server
└── frontend/                 # React + Tailwind UI
    └── src/
        ├── components/             # React components
        ├── utils/                  # Web3 utilities
        └── App.jsx                 # Main app component
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn

### Installation

#### 1. Install Python Dependencies

```bash
cd smart-contracts
pip install -r requirements.txt
```

#### 2. Run Smart Contract Demo (Optional)

```bash
python scripts/deploy.py
```

#### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

#### 4. Configure Backend

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
OWNER_ADDRESS=0xYourOwnerAddressHere
```

#### 5. Start Backend Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

The API will be available at `http://localhost:5000`

#### 6. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

#### 7. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📖 Usage Guide

### For Students

1. Connect your wallet and select "Student" role
2. View your dashboard to see:
   - Total reward tokens earned
   - Blockchain-verified credentials
   - Event participation history
3. Check the leaderboard to see your ranking
4. Collect tokens by attending events and participating in activities

### For Event Organizers

1. Connect with "Event Organizer" role
2. Navigate to the "Manage" tab
3. Create new events with:
   - Event name and description
   - Event type (workshop, competition, etc.)
   - Token reward amount
   - Optional certificate issuance
4. Record student attendance to automatically:
   - Issue reward tokens
   - Mint credentials (if configured)

### For Admins

1. Connect with "Admin" role
2. Access the full Admin Panel
3. Additional capabilities:
   - Issue direct token rewards
   - Create and manage all events
   - Override event settings
   - View system-wide statistics

## 🔌 API Endpoints

### Rewards

- `GET /api/rewards/balance/:address` - Get token balance
- `POST /api/rewards/issue` - Issue direct reward (admin only)
- `POST /api/rewards/transfer` - Transfer tokens
- `GET /api/rewards/leaderboard` - Get top students

### Credentials

- `GET /api/credentials/:address` - Get user's credentials
- `POST /api/credentials/issue` - Issue new credential
- `GET /api/credentials/verify/:tokenId/:address` - Verify credential

### Users & Events

- `GET /api/users/dashboard` - Get user dashboard data
- `POST /api/users/events` - Create new event
- `GET /api/users/events` - Get all events
- `POST /api/users/attendance` - Record student attendance

## 🔐 Authentication

The system uses a simple header-based authentication for demonstration:

- `x-wallet-address`: User's wallet address
- `x-user-role`: User's role (student, organizer, admin)

**Note**: In production, implement proper JWT-based authentication and integrate with actual Web3 wallets (MetaMask, WalletConnect, etc.)

## 🎨 Frontend Components

- **ConnectWallet**: Wallet connection and role selection
- **Dashboard**: Student dashboard with stats and history
- **RewardCard**: Token balance display
- **CredentialCard**: Individual credential/badge display
- **Leaderboard**: Competitive rankings
- **AdminPanel**: Admin and organizer controls

## 🔧 Technology Stack

### Smart Contracts

- Python (contract logic simulation)
- Object-oriented design for ERC-20 and NFT standards

### Backend

- Node.js
- Express.js
- In-memory blockchain simulation

### Frontend

- React 18
- Tailwind CSS
- Lucide React (icons)
- Vite (build tool)

## 📝 Smart Contract Logic

### RewardToken (ERC-20)

- Mintable tokens with authorized minter roles
- Standard transfer and allowance functions
- Admin controls for minter management

### CredentialNFT (Soulbound)

- Non-transferable NFT credentials
- Rich metadata storage
- Revocation functionality
- Verification system

### RewardSystem

- Integrated token and credential management
- Event creation and management
- Attendance tracking
- Student history and analytics

## 🚧 Production Deployment Considerations

1. **Blockchain Integration**

   - Deploy actual Solidity smart contracts to Ethereum/Polygon
   - Integrate Web3.js or Ethers.js
   - Connect to MetaMask or other Web3 wallets

2. **Security**

   - Implement proper JWT authentication
   - Use HTTPS for all connections
   - Implement rate limiting
   - Add input validation and sanitization

3. **Database**

   - Add persistent database (PostgreSQL/MongoDB)
   - Store user profiles and metadata
   - Cache blockchain data for performance

4. **IPFS Integration**

   - Store credential metadata on IPFS
   - Store credential images/documents

5. **Testing**
   - Add comprehensive unit tests
   - Add integration tests
   - Test smart contract interactions

## 📄 License

MIT License - feel free to use this project for educational purposes.

## 🤝 Contributing

This is a learning project. Feel free to fork and customize for your needs!

## 📞 Support

For questions or issues, please open an issue on the repository.
