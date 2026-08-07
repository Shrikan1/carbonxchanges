# 🎯 Complete Frontend Structure for CarbonXchanges

> Based on Backend Analysis - Complete File Structure

## 📁 Root Structure

```
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── main.jsx                     # App entry point
│   ├── App.jsx                      # Route definitions
│   ├── App.css
│   ├── index.css                    # Tailwind imports
│   │
│   ├── api/                         # ✅ API Layer (12 files)
│   ├── components/                  # ✅ Reusable Components
│   ├── pages/                       # ✅ Page Components
│   ├── store/                       # ✅ State Management
│   ├── hooks/                       # ✅ Custom Hooks
│   ├── lib/                         # ✅ Utilities & Constants
│   ├── charts/                      # ✅ Chart Components
│   └── assets/                      # ✅ Images & Static Files
│
├── .env                             # Environment variables
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🌐 API Layer (`src/api/`)

**12 API files mapping to backend routes:**

```
api/
├── axiosClient.js           # ✅ Base Axios instance with JWT interceptor
│
├── authApi.js               # → /api/v1/auth
│   # login, signup, verifyOtp, logout, refreshToken
│
├── profileApi.js            # → /api/v1/profile
│   # getProfile, updateProfile, uploadAvatar
│
├── roleApi.js               # → /api/v1/role
│   # getCurrentRole, requestRoleUpgrade, getRoleCapabilities
│
├── walletApi.js             # → /api/v1/wallet
│   # connectWallet, getWalletBalance, getTransactions
│
├── dashboardApi.js          # → /api/v1/dashboard
│   # getDashboardStats (role-specific)
│
├── projectApi.js            # → /api/v1/projects
│   # getProjects, getProjectById, createProject, updateProject
│
├── projectPostApi.js        # → /api/v1/project-posts
│   # getProjectPosts, createPost, updatePost, deletePost
│
├── verificationApi.js       # → /api/v1/verification
│   # submitForVerification, getVerificationStatus
│
├── salesApi.js              # → /api/v1/sales
│   # getSalesHistory, getSalesStats
│
├── adminApi.js              # → /api/v1/admin
│   # getAllProjects, approveProject, rejectProject, mintCredits
│   # getUserList, agentManagement, oversightActions
│
└── buyerApi.js              # → /api/v1/buyer
    # getMarketplace, purchaseCredits, getPortfolio
    # retireCredits, getCertificates, getTransactionHistory
```

---

## 🧩 Components (`src/components/`)

```
components/
│
├── ui/                              # Basic UI Components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Textarea.jsx
│   ├── Select.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   ├── Badge.jsx
│   ├── Alert.jsx
│   ├── Dropdown.jsx
│   ├── Tabs.jsx
│   ├── Tooltip.jsx
│   └── Pagination.jsx
│
├── layout/                          # Layout Components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── Footer.jsx
│   ├── DashboardLayout.jsx          # Role-aware dashboard shell
│   └── PublicLayout.jsx
│
├── ProtectedRoute.jsx               # Role-based route guard
├── StatusBadge.jsx                  # pending/verified/approved/minted
├── FileUpload.jsx                   # Document & photo upload (IPFS/Pinata)
├── Loader.jsx                       # ✅ Already created
└── ErrorBoundary.jsx                # Error handling wrapper
```

---

## 📄 Pages (`src/pages/`)

### **Shared Pages** (`pages/shared/`)
```
shared/
├── Home.jsx                         # ✅ Landing page
├── Login.jsx                        # ✅ Login form
├── Signup.jsx                       # ✅ Signup form
├── VerifyOtp.jsx                    # ✅ OTP verification
├── Profile.jsx                      # ✅ User profile
├── RoleUpgrade.jsx                  # ✅ Request role upgrade
├── WalletConnect.jsx                # ✅ Connect MetaMask/wallet
└── NotFound.jsx                     # 404 page
```

### **Seller Pages** (`pages/seller/`)
```
seller/
├── SellerDashboard.jsx              # Dashboard overview
├── ProjectRegister.jsx              # Register new project
├── MyProjects.jsx                   # List all projects
├── ProjectDetail.jsx                # Single project view/edit
├── ProjectPosts.jsx                 # Showcase posts management
├── CreditManagement.jsx             # Manage issued credits
├── MarketplaceListing.jsx           # List credits for sale
└── SalesHistory.jsx                 # Sales transactions
```

### **Agent Pages** (`pages/agent/`)
```
agent/
├── AgentDashboard.jsx               # Dashboard overview
├── AssignedProjects.jsx             # Projects to verify
├── VerifyProject.jsx                # Verification form
├── Reinspection.jsx                 # Re-inspection requests
├── VerificationHistory.jsx          # Past verifications
├── Communication.jsx                # Messages with seller/admin
└── Documents.jsx                    # View/upload documents
```

### **Admin Pages** (`pages/admin/`)
```
admin/
├── AdminDashboard.jsx               # Admin overview
├── ReviewQueue.jsx                  # Approve/reject projects
├── AgentManagement.jsx              # Create/manage agents
├── UserManagement.jsx               # Manage all users
├── MintOversight.jsx                # Mint credits, oversight
├── ReversalResolution.jsx           # Handle reversals
└── SystemSettings.jsx               # Platform settings
```

### **Buyer Pages** (`pages/buyer/`)
```
buyer/
├── BuyerDashboard.jsx               # Dashboard overview
├── Marketplace.jsx                  # Browse available credits
├── ProjectExplorer.jsx              # Explore projects
├── PurchaseFlow.jsx                 # Purchase credits
├── Portfolio.jsx                    # My carbon credits
├── TransactionHistory.jsx           # Purchase history
├── RetireCredits.jsx                # Retire credits
└── Certificates.jsx                 # Download certificates
```

---

## 🗄️ State Management (`src/store/`)

**Using Zustand:**

```
store/
├── authStore.js                     # ✅ user, token, role, isAuthenticated
├── walletStore.js                   # walletAddress, balance, isConnected
├── cartStore.js                     # Shopping cart for credits
├── notificationStore.js             # Notifications/alerts
└── themeStore.js                    # Dark/light mode (optional)
```

---

## 🎣 Custom Hooks (`src/hooks/`)

```
hooks/
├── useAuth.js                       # Authentication logic
├── useContract.js                   # ethers.js + MetaMask integration
├── useFetch.js                      # Generic API fetching
├── useDebounce.js                   # Debounce input
├── useLocalStorage.js               # Local storage helper
└── useNotification.js               # Toast notifications
```

---

## 🛠️ Lib/Utils (`src/lib/`)

```
lib/
├── contractConfig.js                # Smart contract address + ABI
├── constants.js                     # Roles, statuses, API routes
├── utils.js                         # Helper functions
├── formatters.js                    # Date, currency formatters
└── validators.js                    # Form validation helpers
```

**Example `constants.js`:**
```javascript
export const ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  AGENT: 'agent',
  ADMIN: 'admin',
};

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  VERIFIED: 'verified',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  MINTED: 'minted',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

## 📊 Charts (`src/charts/`)

```
charts/
├── CreditVolumeChart.jsx            # Volume over time
├── ProjectStatsChart.jsx            # Project statistics
├── SalesChart.jsx                   # Sales analytics
└── EmissionsChart.jsx               # Emissions reduction
```

---

## 🖼️ Assets (`src/assets/`)

```
assets/
├── images/
│   ├── logo.svg
│   ├── os-x-mavericks-3840x2160-24079.jpg     # ✅ Already exists
│   ├── jungle-tree-dark-3840x2160-22695.jpg   # ✅ Already exists
│   └── placeholder.png
│
└── icons/
    └── (custom SVG icons if needed)
```

---

## 🔐 Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_CONTRACT_ADDRESS=0x...
VITE_BLOCKCHAIN_NETWORK=polygon
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

---

## 📋 Summary of Files to Create

### **Priority 1 - Core Foundation (Must Have)**
- [ ] `api/axiosClient.js`
- [ ] `api/authApi.js`
- [ ] `store/authStore.js`
- [ ] `hooks/useAuth.js`
- [ ] `lib/constants.js`
- [ ] `components/layout/DashboardLayout.jsx`
- [ ] `components/ProtectedRoute.jsx`

### **Priority 2 - Shared Pages**
- [x] `pages/shared/Home.jsx` ✅
- [x] `pages/shared/Login.jsx` ✅
- [x] `pages/shared/Signup.jsx` ✅
- [x] `pages/shared/VerifyOtp.jsx` ✅
- [x] `pages/shared/Profile.jsx` ✅
- [x] `pages/shared/RoleUpgrade.jsx` ✅
- [x] `pages/shared/WalletConnect.jsx` ✅

### **Priority 3 - Role-Specific Dashboards**
- [ ] `pages/seller/SellerDashboard.jsx`
- [ ] `pages/buyer/BuyerDashboard.jsx`
- [ ] `pages/agent/AgentDashboard.jsx`
- [ ] `pages/admin/AdminDashboard.jsx`

### **Priority 4 - API Layer**
- [ ] All 12 API files listed above

### **Priority 5 - Role-Specific Features**
- [ ] Seller pages (8 files)
- [ ] Buyer pages (8 files)
- [ ] Agent pages (7 files)
- [ ] Admin pages (7 files)

### **Priority 6 - UI Components**
- [ ] `components/ui/` (12 files)
- [ ] `components/layout/` (5 files)

---

## 🎯 Total File Count

| Category | Files | Status |
|----------|-------|--------|
| API | 12 | ⏳ To Create |
| Pages (Shared) | 8 | ✅ 7/8 Created |
| Pages (Seller) | 8 | ⏳ To Create |
| Pages (Buyer) | 8 | ⏳ To Create |
| Pages (Agent) | 7 | ⏳ To Create |
| Pages (Admin) | 7 | ⏳ To Create |
| Components (UI) | 12 | ⏳ To Create |
| Components (Layout) | 5 | ⏳ To Create |
| Store | 5 | ⏳ To Create |
| Hooks | 6 | ⏳ To Create |
| Lib/Utils | 5 | ⏳ To Create |
| Charts | 4 | ⏳ To Create |
| **TOTAL** | **87** | **7 Done, 80 To Create** |

---

## 🚀 Recommended Build Order

1. **Week 1:** API Layer + Auth Store + Protected Routes
2. **Week 2:** Seller Dashboard + Core Pages
3. **Week 3:** Buyer Dashboard + Marketplace
4. **Week 4:** Agent Dashboard + Verification Flow
5. **Week 5:** Admin Dashboard + Management Tools
6. **Week 6:** UI Polish + Charts + Testing

---

**This structure perfectly maps to your backend and provides a scalable, maintainable frontend architecture!** 🎉
