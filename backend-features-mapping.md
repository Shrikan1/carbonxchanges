# 🎯 Backend Features Analysis & Frontend Requirements

> Complete mapping of backend endpoints to required frontend features

---

## 📊 **VERIFIED BACKEND ROUTES**

### ✅ **Available Routes from app.js:**
```javascript
/api/v1/auth              → Authentication
/api/v1/admin             → Admin operations
/api/v1/agent             → Agent operations  
/api/v1/projects          → Project management (Seller)
/api/v1/project-posts     → Project showcase posts
/api/v1/verification      → Verification workflows
/api/v1/profile           → User profile management
/api/v1/wallet            → Wallet connection
/api/v1/role              → Role upgrade requests
/api/v1/dashboard         → Dashboard stats
/api/v1/sales             → Sales history
/api/v1/buyer             → Buyer marketplace
/v1/share                 → OG metadata (sharing)
```

---

## 🔐 **1. AUTHENTICATION FEATURES** (`/api/v1/auth`)

### Backend Endpoints:
```
POST   /signup          → Register new user
POST   /verify-otp      → Verify email OTP
POST   /login           → Login with email/password
GET    /me              → Get current user profile
POST   /refresh         → Refresh access token
POST   /logout          → Logout and revoke tokens
```

### Frontend Features Required:
✅ **Login Page** - Email/password login with "Remember Me"
✅ **Signup Page** - Name, email, password, role selection
✅ **OTP Verification** - 6-digit OTP input with resend option
- [ ] **Auto Refresh Token** - Silent token refresh before expiry
- [ ] **Logout Confirmation** - Modal before logout
- [ ] **Session Management** - Track user session status

---

## 👤 **2. PROFILE MANAGEMENT** (`/api/v1/profile`)

### Backend Endpoints:
```
GET    /                → Get user profile
PUT    /                → Update profile
PUT    /password        → Change password
```

### Frontend Features Required:
✅ **Profile Page** - View/edit name, email, phone, organization, bio
- [ ] **Change Password** - Current password + new password form
- [ ] **Avatar Upload** - Profile picture upload (if supported)
- [ ] **Notification Preferences** - Email/SMS notification settings

---

## 💰 **3. WALLET MANAGEMENT** (`/api/v1/wallet`)

### Backend Endpoints:
```
GET    /                → Get wallet details
POST   /connect         → Connect wallet (MetaMask)
POST   /disconnect      → Disconnect wallet
```

### Frontend Features Required:
✅ **Wallet Connect Page** - MetaMask connection button
- [ ] **Wallet Dashboard** - Show connected address, balance
- [ ] **Transaction History** - List of wallet transactions
- [ ] **Multiple Wallet Support** - MetaMask, WalletConnect, Coinbase

---

## 🎭 **4. ROLE MANAGEMENT** (`/api/v1/role`)

### Backend Endpoints:
```
POST   /request         → Request role upgrade
POST   /verify          → Verify role upgrade (admin)
```

### Frontend Features Required:
✅ **Role Upgrade Page** - Select new role, provide reason, upload documents
- [ ] **Role Request Status** - Track pending/approved/rejected requests
- [ ] **Role Badge Display** - Show current role with icon
- [ ] **Capability Info** - Show what each role can do

---

## 🏭 **5. SELLER FEATURES** (Projects & Sales)

### Backend Endpoints:

#### **Projects** (`/api/v1/projects`):
```
GET    /mine            → Get my projects
GET    /all             → Get all projects (public)
POST   /                → Create new project
PUT    /:id/submit      → Submit project for review
GET    /:id             → Get project details
DELETE /:id             → Delete project
```

#### **Dashboard** (`/api/v1/dashboard`):
```
GET    /                → Get dashboard summary
```

#### **Sales** (`/api/v1/sales`):
```
GET    /history         → Get sales history
GET    /report/download → Download sales report (CSV/PDF)
```

### Frontend Features Required:
- [ ] **Seller Dashboard** 
  - Total projects count
  - Projects by status (draft, submitted, verified, approved, minted)
  - Total credits issued
  - Total sales & revenue
  - Recent transactions
  
- [ ] **Project Registration**
  - Multi-step form (project details, location, methodology, documents)
  - Document upload (photos, PDFs)
  - Save as draft or submit for review
  
- [ ] **My Projects List**
  - Table/grid view with filters (status, date)
  - Search functionality
  - Quick actions (view, edit, submit, delete)
  - Status badges (draft, under review, verified, approved, minted, rejected)
  
- [ ] **Project Detail View**
  - All project information
  - Timeline/history of status changes
  - Assigned agent info (if any)
  - Verification reports
  - Edit mode (if draft/rejected)
  
- [ ] **Credit Management**
  - View issued credits
  - Create marketplace listings
  - Set price per credit
  - Available vs listed vs sold credits
  
- [ ] **Marketplace Listing**
  - Create new listing
  - Set quantity and price
  - Listing expiry date
  - Active/inactive toggle
  
- [ ] **Sales History**
  - Transaction list with filters
  - Buyer information
  - Amount, date, status
  - Download sales report button
  - Revenue analytics chart

---

## 🔍 **6. AGENT FEATURES** (`/api/v1/agent`)

### Backend Endpoints:
```
GET    /dashboard                      → Agent dashboard summary
GET    /projects                       → Get assigned projects
GET    /projects/due-for-completion    → Projects due for completion
GET    /projects/:id                   → Get project details
POST   /projects/:id/verify/initial    → Submit initial verification
POST   /projects/:id/verify/completion → Submit completion verification
```

### Frontend Features Required:
- [ ] **Agent Dashboard**
  - Assigned projects count
  - Pending verifications
  - Completed verifications
  - Overdue projects alert
  - Earnings summary
  
- [ ] **Assigned Projects List**
  - Projects waiting for verification
  - Priority/due date sorting
  - Filter by status
  - Quick view project summary
  
- [ ] **Project Verification Form**
  - View all project documents
  - Verification checklist
  - Upload site visit photos
  - Add verification notes/comments
  - Approve/Reject/Request changes
  
- [ ] **Initial Verification**
  - Pre-registration verification
  - Document validation
  - Site inspection report
  
- [ ] **Completion Verification**
  - Post-implementation check
  - Credit calculation verification
  - Final approval
  
- [ ] **Verification History**
  - Past verifications
  - Success rate
  - Average turnaround time
  
- [ ] **Communication**
  - Messages with seller
  - Messages with admin
  - Request additional documents
  - Status update notifications

---

## 👨‍💼 **7. ADMIN FEATURES** (`/api/v1/admin`)

### Backend Endpoints:

#### **Agent Management**:
```
POST   /agents                → Create new agent
GET    /agents                → Get all agents
GET    /agents/:id/workload   → Get agent workload
DELETE /projects/:id          → Delete any project
```

#### **Dashboard**:
```
GET    /dashboard             → Admin dashboard summary
```

#### **Project Review**:
```
GET    /projects              → Get review queue
GET    /projects/:id          → Get project details
PUT    /projects/:id/approve  → Approve project
PUT    /projects/:id/reject   → Reject project
PUT    /projects/:id/assign-agent    → Assign agent
PUT    /projects/:id/remove-agent    → Remove agent
```

#### **Minting**:
```
GET    /mint/queue            → Get mintable projects
POST   /mint/:id/retry        → Retry failed mint
```

#### **Oversight**:
```
GET    /oversight/users        → Get all users
GET    /oversight/projects     → Get all projects
GET    /oversight/transactions → Get all transactions
```

### Frontend Features Required:
- [ ] **Admin Dashboard**
  - Total users (by role)
  - Total projects (by status)
  - Pending reviews
  - Minting queue
  - Total credits minted
  - Platform revenue
  - Active agents & workload
  
- [ ] **Review Queue**
  - Projects awaiting approval
  - Filter by status
  - Bulk actions
  - Agent assignment interface
  
- [ ] **Project Approval Interface**
  - View complete project details
  - View verification reports
  - View agent recommendations
  - Approve/Reject with comments
  - Assign/reassign agents
  
- [ ] **Agent Management**
  - Create new agent accounts
  - View all agents list
  - Agent performance metrics
  - Workload distribution view
  - Activate/deactivate agents
  
- [ ] **User Management**
  - All users list
  - Filter by role
  - User details view
  - Ban/suspend user
  - View user activity
  
- [ ] **Mint Oversight**
  - Approved projects ready to mint
  - Minting status tracking
  - Retry failed mints
  - Blockchain transaction logs
  
- [ ] **Transaction Oversight**
  - All platform transactions
  - Filter by type, date, status
  - Transaction details
  - Revenue analytics
  - Export reports
  
- [ ] **System Settings**
  - Platform fees configuration
  - Verification requirements
  - Role capabilities
  - Email templates

---

## 🛍️ **8. BUYER FEATURES** (`/api/v1/buyer`)

### Backend Endpoints:
```
GET    /marketplace           → Browse available credits
GET    /marketplace/:listingId → Get listing details
```

### Frontend Features Required:
- [ ] **Buyer Dashboard**
  - Portfolio summary (total credits owned)
  - Recent purchases
  - Retired credits count
  - Environmental impact metrics
  - Spending analytics
  
- [ ] **Marketplace**
  - Browse available credit listings
  - Filter by:
    - Project type (reforestation, renewable energy, etc.)
    - Price range
    - Location
    - Vintage year
    - Certification standard
  - Search by project name
  - Sort by price, date, rating
  - Grid/list view toggle
  
- [ ] **Listing Detail View**
  - Project information
  - Seller details
  - Price per credit
  - Available quantity
  - Verification status
  - Certificate preview
  - Reviews/ratings (if supported)
  - Add to cart button
  
- [ ] **Purchase Flow**
  - Shopping cart
  - Quantity selector
  - Price calculation with fees
  - Payment method (crypto wallet)
  - Purchase confirmation
  - Transaction receipt
  
- [ ] **Portfolio**
  - List of owned credits
  - Group by project
  - Available vs retired credits
  - Purchase date & price
  - Current market value
  - Certificate download
  
- [ ] **Transaction History**
  - All purchases
  - Date, amount, price paid
  - Transaction hash (blockchain)
  - Receipt download
  
- [ ] **Retire Credits**
  - Select credits to retire
  - Retirement reason
  - Generate retirement certificate
  - Retirement history
  
- [ ] **Certificates**
  - View all certificates
  - Download as PDF
  - Share certificate
  - Verification QR code

---

## 📝 **9. PROJECT POSTS** (`/api/v1/project-posts`)

### Backend Endpoints (Need to verify):
```
GET    /                → Get all project posts (public)
POST   /                → Create project post (seller)
PUT    /:id             → Update project post (seller)
DELETE /:id             → Delete project post (seller)
GET    /:id             → Get single project post
```

### Frontend Features Required:
- [ ] **Project Showcase**
  - Public-facing project stories
  - Rich text editor for posts
  - Photo/video uploads
  - Impact stories
  - Updates timeline
  
- [ ] **Post Management** (Seller)
  - Create new post
  - Edit existing posts
  - Delete posts
  - Schedule posts (future feature)
  
- [ ] **Public Project Page**
  - View project posts
  - Share on social media
  - OG meta tags for sharing (`/v1/share`)

---

## 🔔 **10. MISSING BUT NEEDED FEATURES**

### Features NOT in backend (need to check or add):

1. **Notifications System**
   - In-app notifications
   - Email notifications
   - SMS notifications (optional)
   - Notification preferences
   
2. **Buffer/Reserve Credits**
   - Buffer pool management (admin)
   - Reserve credits for reversals
   
3. **Reversals**
   - Report reversal event
   - Reversal investigation (admin)
   - Resolution workflow
   
4. **Reinspection**
   - Schedule reinspection (agent)
   - Reinspection results
   
5. **Documents Management**
   - Upload documents
   - Document verification status
   - Download documents
   
6. **Communication/Messaging**
   - Agent-Seller messages
   - Agent-Admin messages
   - System announcements
   
7. **Analytics & Reports**
   - Platform analytics
   - User analytics
   - Revenue reports
   - Environmental impact reports
   
8. **Search Functionality**
   - Global search
   - Project search
   - User search
   
9. **Reviews & Ratings**
   - Rate sellers/projects
   - Review system
   
10. **Wishlist/Favorites**
    - Save favorite projects
    - Watch list for buyers

---

## 📊 **FEATURE IMPLEMENTATION PRIORITY**

### **Phase 1: Core Authentication & Profiles** ✅ (In Progress)
- [x] Login
- [x] Signup
- [x] OTP Verification
- [x] Profile View/Edit
- [x] Wallet Connect
- [x] Role Upgrade Request

### **Phase 2: Seller Core Features** (Next)
- [ ] Seller Dashboard
- [ ] Project Registration
- [ ] My Projects List
- [ ] Project Detail View
- [ ] Submit for Review

### **Phase 3: Agent Verification** (Week 3-4)
- [ ] Agent Dashboard
- [ ] Assigned Projects
- [ ] Verification Forms
- [ ] Communication

### **Phase 4: Admin Management** (Week 5-6)
- [ ] Admin Dashboard
- [ ] Review Queue
- [ ] Agent Management
- [ ] Mint Oversight

### **Phase 5: Buyer Marketplace** (Week 7-8)
- [ ] Marketplace Browse
- [ ] Purchase Flow
- [ ] Portfolio
- [ ] Retire Credits

### **Phase 6: Advanced Features** (Week 9-10)
- [ ] Project Posts
- [ ] Analytics & Reports
- [ ] Notifications
- [ ] Search

---

## 🎨 **UI/UX COMPONENTS NEEDED**

### **Common Components:**
- [ ] Status Badge Component (draft, pending, verified, approved, minted, rejected)
- [ ] Project Card Component (for lists/grids)
- [ ] Data Table Component (with sorting, filtering, pagination)
- [ ] File Upload Component (drag-drop, multiple files, progress)
- [ ] Modal Component (confirmation, forms, details)
- [ ] Toast/Notification Component (success, error, info)
- [ ] Loading States (skeleton screens, spinners)
- [ ] Empty States (no data messages)
- [ ] Chart Components (line, bar, pie, area)
- [ ] Timeline Component (project history)
- [ ] Comment/Message Component
- [ ] Search Bar with Autocomplete
- [ ] Filter Panel Component
- [ ] Pagination Component
- [ ] Breadcrumb Navigation
- [ ] Tabs Component
- [ ] Accordion Component
- [ ] Dropdown Menu
- [ ] Date Picker
- [ ] Currency/Number Formatter

---

## 🔧 **TECHNICAL REQUIREMENTS**

### **State Management:**
- Auth State (user, token, role, permissions)
- Cart State (buyer purchases)
- Notification State (unread count, messages)
- Theme State (light/dark mode)
- Filter State (marketplace filters, table filters)

### **API Integration:**
- Axios interceptors for auth tokens
- Error handling (401, 403, 404, 500)
- Loading states
- Retry logic
- Request cancellation

### **Security:**
- Protected routes by role
- Input validation
- XSS prevention
- CSRF protection (cookies)
- Secure file uploads

### **Performance:**
- Lazy loading routes
- Image optimization
- Infinite scroll (large lists)
- Debounced search
- Caching strategies

---

## 📝 **SUMMARY**

### **Total Features to Implement:**
- ✅ **7 Shared Features** (Login, Signup, OTP, Profile, Wallet, Role Upgrade) - DONE
- **8 Seller Features** (Dashboard, Projects, Credits, Listings, Sales)
- **7 Agent Features** (Dashboard, Verification, Communication)
- **12 Admin Features** (Dashboard, Review, Agents, Users, Mint, Oversight)
- **8 Buyer Features** (Dashboard, Marketplace, Purchase, Portfolio, Retire)
- **3 Project Post Features** (Create, View, Manage)
- **6+ Advanced Features** (Notifications, Search, Analytics, etc.)

### **Total: ~50 Feature Sets to Build**

---

**🎯 NEXT STEPS:**
1. Complete Seller Dashboard first (most critical)
2. Build reusable components (DataTable, StatusBadge, FileUpload)
3. Implement API layer with proper error handling
4. Add loading states and empty states
5. Build remaining role-specific features

**This comprehensive mapping shows EXACTLY what needs to be built! 🚀**
