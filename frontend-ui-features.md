# 🎨 Frontend UI Features - Complete Specification

> Comprehensive UI/UX documentation for CarbonXchanges platform
> 
> **Project:** CarbonXchanges - Blockchain Carbon Credit Marketplace
> 
> **Last Updated:** Context Transfer Session

---

## 📋 Table of Contents

1. [Navbar Components](#navbar-components)
2. [Home/Landing Page](#home-landing-page)
3. [Authentication Pages](#authentication-pages)
4. [Shared Pages](#shared-pages)
5. [Seller Pages](#seller-pages)
6. [Buyer Pages](#buyer-pages)
7. [Agent Pages](#agent-pages)
8. [Admin Pages](#admin-pages)
9. [Reusable UI Components](#reusable-ui-components)
10. [Design System](#design-system)

---

## 🧭 1. NAVBAR COMPONENTS

### **A. Public Navbar** (Logged Out State)

**Layout:** Fixed top, transparent on scroll top, solid on scroll down

**Left Side:**
- **Logo**: "CarbonXplanet" (clickable, links to home)
  - Icon: Leaf/tree icon (react-icons: `FaLeaf` or custom)
  - Text: Green gradient (#10b981 to #059669)

**Center/Right Navigation:**
- **Home** - Link to `/`
- **Marketplace** - Link to `/marketplace` (public browse)
- **Projects** - Link to `/projects` (public showcase)
- **About** - Link to `/about`
- **Contact** - Link to `/contact`

**Right Side Buttons:**
- **Login** - Secondary button, outline style
- **Sign Up** - Primary button, solid green (#10b981)
- **Connect Wallet** - Icon button with wallet icon (`FaWallet`)

**Mobile View:**
- Hamburger menu icon (right side)
- Slide-in menu from right with all nav links
- Logo remains visible

---

### **B. Authenticated Navbar** (Logged In State)

**Left Side:** Same as public

**Center Navigation:**
- **Dashboard** - Link to role-specific dashboard
- **Marketplace** - Link to `/marketplace`
- **Projects** - Link to role-specific projects view
- **My Activity** - Link to activity/history

**Right Side:**
- **Notifications Bell** (`FaBell`)
  - Badge with unread count
  - Dropdown with recent notifications
  - "View All" link at bottom
  
- **Wallet Status**
  - If connected: Shortened address (0x1234...5678)
  - If not connected: "Connect Wallet" button
  - Balance display (for buyers)
  
- **User Profile Dropdown**
  - Avatar/initials circle
  - Username/email
  - Dropdown menu:
    - My Profile
    - Settings
    - Role: [Current Role Badge]
    - Upgrade Role (if applicable)
    - Wallet Management
    - Help & Support
    - Logout

---

### **C. Role-Specific Navbar Additions**


**For Sellers:**
- Quick Actions: "Register Project", "View My Projects"
- Sales indicator: "Recent Sales: ₹X"

**For Buyers:**
- Quick Actions: "Browse Credits", "My Portfolio"
- Cart icon with items count

**For Agents:**
- Quick Actions: "Pending Verifications"
- Alert badge: "X Projects Due"

**For Admin:**
- Quick Actions: "Review Queue", "Agent Management"
- Admin badge/indicator

---

## 🏠 2. HOME/LANDING PAGE

### **Hero Section** (Full viewport height)

**Background:**
- Image: `jungle-tree-dark-3840x2160-22695.jpg`
- Overlay: Dark gradient (rgba(0,0,0,0.5) to transparent)
- Parallax scroll effect (optional)

**Content:**
- **Main Heading** (h1, 60px, bold, white)
  - "Tokenizing Verified Carbon Credits"
  - "with Blockchain Technology"
  
- **Subheading** (h3, 24px, light green)
  - "Register, verify, tokenize, trade, and retire carbon credits securely on the blockchain"
  
- **CTA Buttons** (2 large buttons)
  - Primary: "Register Your Project" → `/signup?role=seller`
  - Secondary: "Explore Marketplace" → `/marketplace`
  
- **Trust Indicators** (icons below buttons)
  - Blockchain verified icon
  - Secure transactions icon
  - Trusted by X sellers/buyers

**Scroll Down Indicator:**
- Animated down arrow
- "Scroll to explore" text

---

### **Trusted By / Partners Section**

**Layout:** 6-8 logo cards, horizontal scroll or grid

**Logos:**
- Polygon
- Supabase
- IPFS / Pinata
- OpenZeppelin
- Ethereum
- MIT College / Your University
- Environmental certification bodies

**Design:** Grayscale logos on hover → colored

---

### **What is CarbonXchanges Section**

**Layout:** Two columns (60-40 split)

**Left Side:**
- **Heading:** "What is CarbonXchanges?"
- **Description:** (3-4 paragraphs explaining platform)
  - Blockchain-powered marketplace
  - Verified environmental projects
  - Digital carbon credit tokens
  - Transparent trading and retirement
  
- **Key Features** (3-4 bullet points with icons)
  - ✅ Verified Projects
  - 🔗 Blockchain Secured
  - 💰 Transparent Trading
  - 📜 Retirement Certificates

**Right Side:**
- **Process Flow Diagram**
  - Seller → Agent → Admin → Blockchain → Buyer
  - Animated arrows/connections
  - Icons for each role

---

### **How It Works Section**

**Layout:** Vertical timeline or stepper

**Steps:** (8 steps with icons and descriptions)

1. **Register Project** (`FaFileAlt`)
   - Sellers submit project details and documents
   
2. **Upload Documents** (`FaCloudUploadAlt`)
   - Site photos, PDFs, certifications
   
3. **Agent Verification** (`FaUserCheck`)
   - Independent verification by assigned agent
   
4. **Admin Approval** (`FaCheckCircle`)
   - Final review and approval by admin
   
5. **ERC-1155 Token Minting** (`FaCoins`)
   - Smart contract mints carbon credits on blockchain
   
6. **Marketplace Listing** (`FaStore`)
   - Credits listed for sale with pricing
   
7. **Buyer Purchase** (`FaShoppingCart`)
   - Buyers purchase credits via crypto wallet
   
8. **Credit Retirement** (`FaFireAlt`)
   - Permanent retirement and certificate generation

**Design:** Each step connects with animated line, hover reveals details

---

### **Project Categories Section**

**Layout:** Grid of 8 cards (4x2 on desktop, 2x4 on tablet, 1x8 on mobile)

**Categories:**

1. **🌱 Mangrove Restoration**
   - Description: Coastal ecosystem restoration
   - Sample projects: 12+
   
2. **🌳 Afforestation**
   - Description: Creating new forests
   - Sample projects: 8+
   
3. **🌲 Reforestation**
   - Description: Restoring degraded forests
   - Sample projects: 15+
   
4. **☀️ Solar Energy**
   - Description: Renewable energy projects
   - Sample projects: 6+
   
5. **💨 Wind Energy**
   - Description: Wind power generation
   - Sample projects: 4+
   
6. **♻️ Waste Management**
   - Description: Waste-to-energy conversion
   - Sample projects: 7+
   
7. **🌾 Sustainable Agriculture**
   - Description: Regenerative farming
   - Sample projects: 10+
   
8. **🚗 Green Transportation**
   - Description: Electric vehicle infrastructure
   - Sample projects: 3+

**Card Design:**
- Icon/emoji (large)
- Category name
- Short description
- "X Projects" count
- "Explore" button
- Hover: Card lifts, border glow

**Interaction:** Click opens filtered marketplace

---

### **Featured Carbon Projects Section**

**Layout:** Horizontal scrollable carousel (3-4 cards visible)

**Project Card Contents:**
- Project image (background)
- Category badge (top-left)
- Verification status badge (top-right)
- **Project Name** (h3)
- **Location** with map pin icon
- **Verified Credits:** X,XXX
- **Status:** Verified/Approved/Minted
- Progress bar (credits issued vs available)
- "View Project" button

**Design:** 
- Card shadow on hover
- Navigation arrows left/right
- Dot indicators at bottom
- Auto-scroll every 5 seconds

---

### **Marketplace Preview Section**

**Heading:** "Trade Carbon Credits Now"

**Layout:** Table or grid (6 listings visible)

**Table Columns:**
1. Project Name (with thumbnail)
2. Seller Name
3. Price per Credit (₹/credit)
4. Available Credits
5. Action Button ("Buy Now")

**Design:**
- Alternating row colors
- Sort by price/date/quantity
- "View Full Marketplace" button at bottom

---

### **Live Platform Statistics Section**

**Layout:** 6 stat cards in 2 rows (3x2)

**Stats:** (Animated counters on scroll into view)

1. **150+**
   - Registered Projects
   - Icon: `FaFileAlt`
   
2. **22,000+**
   - Carbon Credits Minted
   - Icon: `FaCoins`
   
3. **600+**
   - Active Buyers
   - Icon: `FaUsers`
   
4. **120+**
   - Verified Sellers
   - Icon: `FaStore`
   
5. **18**
   - Certified Agents
   - Icon: `FaUserCheck`
   
6. **96%**
   - Projects Verified Successfully
   - Icon: `FaCheckCircle`

**Design:**
- Background gradient (green to teal)
- White text
- Icon at top
- Large number
- Description below
- Hover: Scale up slightly

---

### **Why Blockchain Section**

**Layout:** 6 feature cards (3x2 grid)

**Features:**

1. **Immutable Records** (`FaLock`)
   - All transactions permanently recorded
   
2. **Transparent Verification** (`FaEye`)
   - Public verification trail
   
3. **Prevent Double Spending** (`FaBan`)
   - Each credit unique and traceable
   
4. **Secure Ownership** (`FaShieldAlt`)
   - Cryptographic proof of ownership
   
5. **ERC-1155 Tokenization** (`FaEthereum`)
   - Industry-standard token format
   
6. **Decentralized Trust** (`FaNetworkWired`)
   - No single point of failure

**Design:**
- Icon at top (large, green)
- Bold heading
- 2-3 line description
- Light border, hover effect

---

### **Environmental Impact Section**

**Layout:** 4 large impact counters with visual indicators

**Impacts:**

1. **25,000 Tonnes**
   - CO₂ Reduced
   - Icon: Cloud with down arrow
   - Visual: Animated CO₂ molecules
   
2. **200,000 Trees**
   - Protected/Planted
   - Icon: Tree
   - Visual: Forest illustration
   
3. **15 Countries**
   - Projects Active
   - Icon: Globe
   - Visual: World map with pins
   
4. **18 SDGs**
   - UN Goals Supported
   - Icon: UN SDG wheel
   - Visual: SDG icons grid

**Design:**
- Large numbers with animations
- Background images/illustrations
- Green color theme
- Side-by-side layout

---

### **Testimonials Section**

**Layout:** Carousel or 3-card grid

**Testimonial Card:**
- Quote text (italic)
- Star rating (5 stars)
- Avatar/photo
- Name
- Role (Seller/Buyer/Agent/Organization)
- Location

**Examples:**

**Seller Testimonial:**
> "CarbonXchanges made it easy to tokenize our mangrove restoration project. The verification process was transparent and professional."
> 
> — Rajesh Kumar, Green Earth Foundation, Maharashtra

**Buyer Testimonial:**
> "I love the transparency. Every credit is traceable on blockchain, giving me confidence in my carbon offset investments."
> 
> — Sarah Johnson, Corporate Sustainability Manager, Tech Corp

**Agent Testimonial:**
> "As a verification agent, the platform streamlines the entire process. Document management and reporting are seamless."
> 
> — Dr. Priya Sharma, Environmental Consultant

---

### **Latest News/Activity Section**

**Layout:** Timeline or 4 news cards

**News Items:**

1. **Mangrove Project Approved**
   - Date: 2 days ago
   - Icon: Check circle
   - Brief: "Green Coast Initiative approved by admin..."
   
2. **5000 Credits Minted**
   - Date: 5 days ago
   - Icon: Coins
   - Brief: "Solar Valley Project successfully minted..."
   
3. **New Buyer Joined**
   - Date: 1 week ago
   - Icon: User plus
   - Brief: "EcoTech Solutions joined as buyer..."
   
4. **Solar Project Verified**
   - Date: 2 weeks ago
   - Icon: Sun
   - Brief: "Renewable Energy Project completed verification..."

**Design:**
- Icon, date, title, brief description
- "Read More" link
- Hover: Card elevation

---

### **Live Carbon Credit Lifecycle (UNIQUE FEATURE)** 🌟

**Layout:** Animated vertical/horizontal flow diagram

**Animation:** Real-time data flowing through stages

**Stages:**
1. Seller → Register (icon animates)
2. Documents → Upload (progress bar)
3. Agent → Verification (checkmark appears)
4. Admin → Approval (stamp animation)
5. Blockchain → Minting (coin minting animation)
6. Marketplace → Listing (appears on shelf)
7. Buyer → Purchase (transaction animation)
8. Retirement → Burn (fire animation)
9. Certificate → Generated (document appears)

**Design:**
- Connected with animated lines/arrows
- Each stage has icon, status indicator
- Clicking a stage shows details
- Real-time platform stats update
- Data flows like electricity through circuit

**Uniqueness:** Most carbon marketplaces don't visualize this end-to-end

---

### **Call to Action Section**

**Background:** Green gradient with pattern overlay

**Content:**
- **Heading:** "Ready to Make an Environmental Impact?"
- **Subheading:** "Join thousands of sellers, buyers, and agents creating a sustainable future"
- **Two Large CTA Buttons:**
  - Primary: "Register Your Project" (white on green)
  - Secondary: "Browse Marketplace" (outline)
  
**Stats Bar Below:**
- "Join 150+ projects"
- "22K+ credits traded"
- "96% success rate"

---

### **Footer**

**Layout:** 4 columns + bottom bar

**Column 1: About**
- Logo
- Short description (2-3 lines)
- Social media icons:
  - GitHub
  - LinkedIn
  - Twitter
  - Instagram

**Column 2: Platform**
- Home
- About Us
- Marketplace
- Projects
- How It Works
- Pricing

**Column 3: Resources**
- Documentation
- API Docs
- Whitepaper
- Blog
- FAQ
- Help Center

**Column 4: Legal**
- Terms of Service
- Privacy Policy
- Cookie Policy
- Contact Us
- Support

**Bottom Bar:**
- Copyright: "© 2026 CarbonXchanges. All rights reserved."
- Powered by: Polygon, Supabase, IPFS
- Language selector (optional)
- Theme toggle (dark/light)

---

## 🔐 3. AUTHENTICATION PAGES

### **A. Login Page** ✅ (COMPLETED)

**Current Implementation:**
- Split-screen layout (form left, image right)
- Background: `jungle-tree-dark-3840x2160-22695.jpg`
- Email and password fields
- Remember me checkbox
- Forgot password link
- Social login buttons (Google, Apple)
- Green theme (#10b981)
- Responsive design

**No additional features needed for now**

---

### **B. Signup Page**

**Layout:** Similar to Login (split-screen or centered form)

**Form Fields:**
1. **Full Name** (required)
   - Input with user icon
   - Validation: Min 3 characters
   
2. **Email Address** (required)
   - Input with email icon
   - Validation: Valid email format
   
3. **Phone Number** (optional)
   - Input with phone icon
   - Country code selector
   
4. **Organization** (optional for sellers/agents)
   - Input field
   
5. **Password** (required)
   - Input with password icon
   - Show/hide toggle
   - Strength indicator (weak/medium/strong)
   - Requirements:
     - Min 8 characters
     - 1 uppercase, 1 lowercase
     - 1 number, 1 special char
   
6. **Confirm Password** (required)
   - Must match password
   
7. **Role Selection** (required)
   - Radio buttons or card selection:
     - 🛒 **Buyer** - Purchase carbon credits
     - 🏭 **Seller** - Register projects
     - 🔍 **Agent** - Verify projects (application required)
   - Each option has icon, title, description
   
8. **Terms Checkbox** (required)
   - "I agree to Terms of Service and Privacy Policy"
   - Links open in modal

**Social Signup:**
- "Sign up with Google" button
- "Sign up with Apple" button

**Already Have Account:**
- "Already have an account? Login" link

**Submit Button:**
- "Create Account" (disabled until form valid)
- Loading spinner on submit
- Success → Redirect to OTP verification

---

### **C. Verify OTP Page**

**Layout:** Centered card on full-screen background

**Content:**
- **Icon:** Email envelope with checkmark
- **Heading:** "Verify Your Email"
- **Subheading:** "We sent a 6-digit code to your@email.com"
- **Edit Email** link (goes back to signup)

**OTP Input:**
- 6 individual input boxes (auto-focus next box)
- Large, centered
- Auto-submit when all 6 digits entered

**Actions:**
- **Didn't receive code?**
  - "Resend OTP" link (with countdown timer: 00:59)
  - Shows "OTP sent!" toast on resend
  
**Submit Button:**
- "Verify Email" (auto-submits when OTP complete)
- Loading state
- Success → Redirect to dashboard

**Error Handling:**
- Invalid OTP: Show error below boxes
- Expired OTP: Show message with resend option

---

### **D. Forgot Password Page**

**Layout:** Centered form

**Step 1: Enter Email**
- Email input
- "Send Reset Link" button
- Success message: "Check your email for reset link"

**Step 2: Enter New Password (from email link)**
- New password input
- Confirm password input
- Password strength indicator
- "Reset Password" button
- Success → Redirect to login

---

## 👤 4. SHARED PAGES

### **A. Profile Page**

**Layout:** Two columns (sidebar + main content)

**Sidebar:**
- Profile photo (large)
  - Upload/change photo button
  - Avatar with initials if no photo
- Name (large text)
- Email
- Role badge (colored)
- Member since date
- Verification status badge

**Main Content Tabs:**

**1. Personal Information Tab**
- **Form Fields:**
  - Full Name (editable)
  - Email (read-only, show "Verified" badge)
  - Phone Number (editable)
  - Organization (editable)
  - Bio/Description (textarea)
  - Location (country, city)
  - Website (optional)
- **Save Changes** button
- **Cancel** button

**2. Security Tab**
- **Change Password Section:**
  - Current password
  - New password
  - Confirm new password
  - "Update Password" button
  
- **Two-Factor Authentication** (future):
  - Enable/disable 2FA
  - QR code setup
  
- **Active Sessions:**
  - List of devices/locations
  - "Sign out all other sessions" button

**3. Notifications Tab**
- **Email Notifications:**
  - Project updates
  - Transaction alerts
  - Verification status
  - Marketing emails
  - Toggle switches for each
  
- **Push Notifications:**
  - Browser notifications toggle
  - Similar categories

**4. Connected Accounts Tab**
- **Wallet Connection:**
  - Connected wallet address
  - "Disconnect" button
  - "Connect Another Wallet" button
  
- **Social Accounts:**
  - Google (connected/not connected)
  - Apple (connected/not connected)

---

### **B. Role Upgrade Page**

**Layout:** Centered form with steps indicator

**Current Role Display:**
- Badge showing current role
- "Upgrade your account to unlock more features"

**Role Selection:**
- Card-based selection:
  - From Buyer → Seller
  - From Buyer → Agent
  - From Seller → Agent
  
**Upgrade Form:**

**For Seller Upgrade:**
- Organization name
- Organization type (NGO, Company, Individual)
