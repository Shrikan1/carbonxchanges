# CarbonXchanges

A blockchain-powered carbon credit marketplace connecting sellers, buyers, and verification agents in a transparent ecosystem.

## 🌟 Features

- **Blockchain Security** - All transactions recorded on blockchain
- **Verified Projects** - Professional agent verification system
- **Instant Trading** - Real-time pricing and settlement
- **Global Marketplace** - Access projects worldwide
- **Role-Based Access** - Seller, Buyer, Agent, and Admin roles
- **Wallet Integration** - MetaMask and crypto wallet support

## 🏗️ Project Structure

```
carbonxchanges/
├── backend/           # Node.js + Express API
├── frontend/          # React + Vite + Tailwind CSS
└── blockchain/        # Smart contracts
```

## 📦 Frontend Dependencies

### Core Dependencies
- **React** (^19.2.8) - UI library
- **React DOM** (^19.2.8) - React DOM rendering
- **Vite** (^8.2.0) - Build tool and dev server
- **Tailwind CSS** (^4.3.3) - Utility-first CSS framework
- **@tailwindcss/vite** (^4.3.3) - Tailwind Vite plugin

### Additional Libraries
- **React Icons** (^5.7.0) - Icon library (FontAwesome, Material Design, etc.)
- **Axios** (latest) - HTTP client for API calls
- **React Router DOM** (latest) - Client-side routing
- **Zustand** (latest) - State management

### Development Dependencies
- **ESLint** (^10.8.0) - Code linting
- **@vitejs/plugin-react** (^6.0.4) - React plugin for Vite
- **TypeScript Types** - Type definitions for React

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (for backend)

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   DATABASE_URL=postgresql://user:password@localhost:5432/carbonxchanges
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🌐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_CONTRACT_ADDRESS=your_contract_address
```

### Backend (.env)
```env
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:password@localhost:5432/carbonxchanges
```

## 📁 Frontend File Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/                    # API integration
│   │   ├── axiosClient.js      # Axios instance
│   │   ├── authApi.js          # Auth endpoints
│   │   ├── projectApi.js       # Project endpoints
│   │   └── ...
│   ├── assets/                 # Images, fonts, etc.
│   ├── components/             # Reusable components
│   │   ├── ui/                 # UI components
│   │   └── layout/             # Layout components
│   ├── pages/                  # Page components
│   │   ├── shared/             # Shared pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ...
│   │   ├── seller/             # Seller pages
│   │   ├── buyer/              # Buyer pages
│   │   ├── agent/              # Agent pages
│   │   └── admin/              # Admin pages
│   ├── store/                  # State management (Zustand)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and helpers
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── package.json
└── vite.config.js
```

## 🎨 Tech Stack

### Frontend
- React 19
- Vite 8
- Tailwind CSS 4
- React Router DOM
- Zustand (State Management)
- Axios (HTTP Client)
- React Icons

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt

### Blockchain
- Ethereum
- Solidity
- Web3.js / Ethers.js

## 🔐 User Roles

1. **Seller** - Register and sell carbon credit projects
2. **Buyer** - Purchase carbon credits
3. **Verification Agent** - Verify projects for credibility
4. **Admin** - Oversee platform operations

## 📱 Features by Role

### Seller
- Register carbon reduction projects
- Upload project documentation
- List credits for sale
- Track sales and revenue

### Buyer
- Browse verified projects
- Purchase carbon credits
- Manage portfolio
- Retire credits with certificates

### Verification Agent
- Review project applications
- Conduct inspections
- Approve/reject projects
- Earn per verification

### Admin
- Approve projects
- Manage agents
- Monitor platform
- Handle disputes

## 🛠️ Scripts

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Backend
```bash
npm run dev        # Start development server
npm start          # Start production server
```

## 📝 License

This project is private and proprietary.

## 👥 Contributors

- Development Team

## 📞 Support

For support, please contact the development team.

---

**Built with 💚 for a sustainable future**
