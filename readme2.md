frontend/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── main.jsx
│   │   # React application entry point.
│   │   # Renders the root App component into the DOM.
│   │
│   ├── App.jsx
│   │   # Defines application routes and page navigation.
│   │
│   ├── App.css
│   ├── index.css
│   │   # Global styles and Tailwind CSS imports.
│   │
│   ├── api/
│   │   # Handles all communication with the backend API.
│   │   ├── axiosClient.js
│   │   │   # Shared Axios instance with base URL,
│   │   │   # JWT interceptor and default configuration.
│   │   │
│   │   ├── authApi.js
│   │   ├── adminApi.js
│   │   ├── agentApi.js
│   │   ├── buyerApi.js
│   │   ├── dashboardApi.js
│   │   ├── profileApi.js
│   │   ├── projectApi.js
│   │   ├── projectPostApi.js
│   │   ├── roleApi.js
│   │   ├── salesApi.js
│   │   ├── verificationApi.js
│   │   └── walletApi.js
│   │
│   ├── components/
│   │   # Reusable UI components used throughout the applin
│   │   │
│   │   ├── ui/
│   │   │   # Generic UI building blocks.
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Badge.jsx
│   │   │
│   │   ├── layout/
│   │   │   # Common layout components shared by pages.
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   │   # Main dashboard shell.
│   │   │   │   # Sidebar changes according to user role.
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── ProtectedRoute.jsx
│   │   │   # Restricts access based on authentication & role.
│   │   │
│   │   ├── StatusBadge.jsx
│   │   │   # Displays project status such as Pending,
│   │   │   # Approved, Verified, Minted, etc.
│   │   │
│   │   ├── FileUpload.jsx
│   │   │   # Uploads project documents, images,
│   │   │   # and IPFS/Pinata files.
│   │   │
│   │   └── Loader.jsx
│   │       # Loading spinner.
│   │
│   ├── pages/
│   │   # Application pages grouped by user role.
│   │   │
│   │   ├── shared/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── VerifyOtp.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── RoleUpgrade.jsx
│   │   │   └── WalletConnect.jsx
│   │   │
│   │   ├── seller/
│   │   │   ├── SellerDashboard.jsx
│   │   │   ├── ProjectRegister.jsx
│   │   │   ├── MyProjects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── ProjectPosts.jsx
│   │   │   ├── CreditManagement.jsx
│   │   │   ├── MarketplaceListing.jsx
│   │   │   └── SalesHistory.jsx
│   │   │
│   │   ├── agent/
│   │   │   ├── AgentDashboard.jsx
│   │   │   ├── AssignedProjects.jsx
│   │   │   ├── VerifyProject.jsx
│   │   │   ├── Reinspection.jsx
│   │   │   ├── VerificationHistory.jsx
│   │   │   └── Communication.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ReviewQueue.jsx
│   │   │   ├── AgentManagement.jsx
│   │   │   ├── MintOversight.jsx
│   │   │   └── ReversalResolution.jsx
│   │   │
│   │   └── buyer/
│   │       ├── BuyerDashboard.jsx
│   │       ├── Marketplace.jsx
│   │       ├── PurchaseFlow.jsx
│   │       ├── Portfolio.jsx
│   │       ├── TransactionHistory.jsx
│   │       ├── RetireCredits.jsx
│   │       └── Certificates.jsx
│   │
│   ├── store/
│   │   # Global state management (Zustand).
│   │   ├── authStore.js
│   │   ├── walletStore.js
│   │   └── cartStore.js
│   │
│   ├── hooks/
│   │   # Custom reusable React hooks.
│   │   ├── useAuth.js
│   │   ├── useContract.js
│   │   └── useFetch.js
│   │
│   ├── lib/
│   │   # Configuration and utility files.
│   │   ├── contractConfig.js
│   │   ├── constants.js
│   │   └── utils.js
│   │
│   ├── charts/
│   │   └── CreditVolumeChart.jsx
│   │
│   └── assets/
│       └── images/
│
├── .env
│   # Frontend environment variables.
│
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js