import { useEffect, lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';

const Home = lazy(() => import('./pages/shared/Home'));
const AuthPage = lazy(() => import('./pages/auth/AuthPage'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const About = lazy(() => import('./pages/shared/About'));
const Contact = lazy(() => import('./pages/shared/Contact'));
const Article = lazy(() => import('./pages/shared/Article'));
const Posts = lazy(() => import('./pages/shared/Posts'));
const PostDetail = lazy(() => import('./pages/shared/PostDetail'));

const ProjectListPage = lazy(() => import('./pages/seller/ProjectListPage'));
const ProjectFormPage = lazy(() => import('./pages/seller/ProjectFormPage'));
const SellerProjectDetailPage = lazy(() => import('./pages/seller/SellerProjectDetailPage'));

import RequireAuth from './components/RequireAuth';
const ProfilePage = lazy(() => import('./pages/shared/ProfilePage'));

import { useAuthStore } from './store/useAuthStore';
import * as authApi from './api/endpoint/Authapi';


const PublicProjectShowcasePage = lazy(() => import('./pages/shared/PublicProjectShowcasePage'));
const MarketplaceDetailPage = lazy(() => import('./pages/shared/MarketplaceDetailPage'));
const ProjectPostEditorPage = lazy(() => import('./pages/seller/ProjectPostEditorPage'));
const ProjectVerificationPage = lazy(() => import('./pages/seller/ProjectVerificationPage'));
const CreditsPage = lazy(() => import('./pages/seller/CreditsPage'));
const ListingsPage = lazy(() => import('./pages/seller/ListingsPage'));
const SalesPage = lazy(() => import('./pages/seller/SalesPage'));
const SellerWalletPage = lazy(() => import('./pages/seller/SellerWalletPage'));

const WalletPage = lazy(() => import('./pages/shared/WalletPage'));
const DashboardPage = lazy(() => import('./pages/shared/DashboardPage'));
const MarketplacePage = lazy(() => import('./pages/shared/MarketplacePage'));

const AdminReviewQueuePage = lazy(() => import('./pages/admin/AdminReviewQueuePage'));
const AdminProjectDetailPage = lazy(() => import('./pages/admin/AdminProjectDetailPage'));
const AdminAgentsPage = lazy(() => import('./pages/admin/AdminAgentsPage'));
const AdminMintQueuePage = lazy(() => import('./pages/admin/AdminMintQueuePage'));
const AdminOversightUsersPage = lazy(() => import('./pages/admin/AdminOversightUsersPage'));
const AdminOversightProjectsPage = lazy(() => import('./pages/admin/AdminOversightProjectsPage'));
const AdminOversightTransactionsPage = lazy(() => import('./pages/admin/AdminOversightTransactionsPage'));
const AdminReversalsPage = lazy(() => import('./pages/admin/AdminReversalsPage'));

const AgentAssignedProjectsPage = lazy(() => import('./pages/agent/AgentAssignedProjectsPage'));
const AgentProjectDetailPage = lazy(() => import('./pages/agent/AgentProjectDetailPage'));
const AgentHistoryPage = lazy(() => import('./pages/agent/AgentHistoryPage'));

// Buyer pages
const BuyerPortfolioPage = lazy(() => import('./pages/buyer/BuyerPortfolioPage'));
const BuyerRetirePage = lazy(() => import('./pages/buyer/BuyerRetirePage'));
const BuyerCertificatesPage = lazy(() => import('./pages/buyer/BuyerCertificatesPage'));
const BuyerTransactionsPage = lazy(() => import('./pages/buyer/BuyerTransactionsPage'));
const BuyerOrdersPage = lazy(() => import('./pages/buyer/BuyerOrdersPage'));

const NotFoundPage = lazy(() => import('./pages/shared/NotFoundPage'));

import { Toaster } from 'react-hot-toast';

const RootLayout = () => (
  <>
    <ScrollRestoration />
    <Toaster position="top-center" reverseOrder={false} />
    <Suspense fallback={<div className="flex h-screen items-center justify-center font-semibold text-gray-500">Loading...</div>}>
      <Outlet />
    </Suspense>
  </>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
  {
    path: '/',
    element: <Home />,
  },

  {
    path: '/about',
    element: <About />,
  },

  {
    path: '/contact',
    element: <Contact />,
  },

  {
    path: '/posts',
    element: <Posts />,
  },

  {
    path: '/posts/:postId',
    element: (
      <RequireAuth>
        <PostDetail />
      </RequireAuth>
    ),
  },

  {
    path: '/article',
    element: <Article />,
  },


  {
    path: '/signup',
    element: <AuthPage />,
  },

  {
    path: '/login',
    element: <AuthPage />,
  },

  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },

  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },

  // Profile
  {
    path: '/profile',
    element: (
      <RequireAuth>
        <ProfilePage />
      </RequireAuth>
    ),
  },

  // Seller Projects
  {
    path: '/seller/projects',
    element: (
      <RequireAuth requireSeller={true}>
        <ProjectListPage />
      </RequireAuth>
    ),
  },

  // Create New Project
  {
    path: '/seller/projects/new',
    element: (
      <RequireAuth requireSeller={true}>
        <ProjectFormPage />
      </RequireAuth>
    ),
  },

  // Edit Draft Project
  {
    path: '/seller/projects/:projectId/edit',
    element: (
      <RequireAuth requireSeller={true}>
        <ProjectFormPage />
      </RequireAuth>
    ),
  },

  // Seller Project Detail View
  {
    path: '/seller/projects/:id/details',
    element: (
      <RequireAuth requireSeller={true}>
        <SellerProjectDetailPage />
      </RequireAuth>
    ),
  },

  {
    path: '/projects/:projectId',
    element: (
      <RequireAuth>
        <PublicProjectShowcasePage />
      </RequireAuth>
    ),
  },

  // Seller project editor
  {
    path: '/seller/projects/:projectId/post',
    element: (
      <RequireAuth requireSeller={true}>
        <ProjectPostEditorPage />
      </RequireAuth>
    ),
  },
  {
    path: '/seller/post/new',
    element: (
      <RequireAuth requireSeller={true}>
        <ProjectPostEditorPage />
      </RequireAuth>
    ),
  },
  {
  path: '/seller/projects/:projectId/verification',
  element: (
    <RequireAuth requireSeller={true}>
      <ProjectVerificationPage />
    </RequireAuth>
  ),
},

{
  path: '/seller/credits',
  element: (
    <RequireAuth requireSeller={true}>
      <CreditsPage />
    </RequireAuth>
  ),
},

{
  path: '/seller/listings',
  element: (
    <RequireAuth requireSeller={true}>
      <ListingsPage />
    </RequireAuth>
  ),
},

{
  path: '/seller/sales',
  element: (
    <RequireAuth requireSeller={true}>
      <SalesPage />
    </RequireAuth>
  ),
},

{
  path: '/seller/wallet',
  element: (
    <RequireAuth requireSeller={true}>
      <SellerWalletPage />
    </RequireAuth>
  ),
},

  // Wallet
{
  path: '/wallet',
  element: (
    <RequireAuth>
      <WalletPage />
    </RequireAuth>
  ),
},

// Marketplace
{
  path: '/marketplace',
  element: <MarketplacePage />,
},
{
  path: '/marketplace/:listingId',
  element: (
    <RequireAuth>
      <MarketplaceDetailPage />
    </RequireAuth>
  ),
},

// Dashboard
{
  path: '/dashboard',
  element: (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
},

// Admin - Project Review
{
  path: '/admin/projects',
  element: (
    <RequireAuth allowedRoles={['admin']}>
      <AdminReviewQueuePage />
    </RequireAuth>
  ),
},

// Admin - Project Detail
{
  path: '/admin/projects/:id',
  element: (
    <RequireAuth allowedRoles={['admin']}>
      <AdminProjectDetailPage />
    </RequireAuth>
  ),
},

// Admin - Agents
{
  path: '/admin/agents',
  element: (
    <RequireAuth allowedRoles={['admin']}>
      <AdminAgentsPage />
    </RequireAuth>
  ),
},

// Admin - Mint Queue
{
  path: '/admin/mint-queue',
  element: (
    <RequireAuth allowedRoles={['admin']}>
      <AdminMintQueuePage />
    </RequireAuth>
  ),
},

// Admin - Oversight Users
{
  path: '/admin/oversight/users',
  element: (
    <RequireAuth allowedRoles={['admin']}>
      <AdminOversightUsersPage />
    </RequireAuth>
  ),
},

// Admin - Oversight Projects
{
  path: '/admin/oversight/projects',
  element: (
    <RequireAuth allowedRoles={['admin']}>
      <AdminOversightProjectsPage />
    </RequireAuth>
  ),
},

// Admin - Oversight Transactions
{
  path: '/admin/oversight/transactions',
  element: (
    <RequireAuth allowedRoles={['admin']}>
      <AdminOversightTransactionsPage />
    </RequireAuth>
  ),
},

// Admin - Reversals
{
  path: '/admin/reversals',
  element: (
    <RequireAuth allowedRoles={['admin']}>
      <AdminReversalsPage />
    </RequireAuth>
  ),
},
// Agent - Assigned Projects
{
  path: '/agent/projects',
  element: (
    <RequireAuth allowedRoles={['agent', 'admin']}>
      <AgentAssignedProjectsPage />
    </RequireAuth>
  ),
},

// Agent - Project Detail
{
  path: '/agent/projects/:id',
  element: (
    <RequireAuth allowedRoles={['agent', 'admin']}>
      <AgentProjectDetailPage />
    </RequireAuth>
  ),
},

// Agent - History
{
  path: '/agent/history',
  element: (
    <RequireAuth allowedRoles={['agent', 'admin']}>
      <AgentHistoryPage />
    </RequireAuth>
  ),
},


// Buyer - Portfolio
{
  path: '/buyer/portfolio',
  element: (
    <RequireAuth requireBuyer={true}>
      <BuyerPortfolioPage />
    </RequireAuth>
  ),
},

// Buyer - Retire Credits
{
  path: '/buyer/retire',
  element: (
    <RequireAuth requireBuyer={true}>
      <BuyerRetirePage />
    </RequireAuth>
  ),
},

// Buyer - Retirement Certificates
{
  path: '/buyer/certificates',
  element: (
    <RequireAuth requireBuyer={true}>
      <BuyerCertificatesPage />
    </RequireAuth>
  ),
},

// Buyer - Transaction History
{
  path: '/buyer/transactions',
  element: (
    <RequireAuth requireBuyer={true}>
      <BuyerTransactionsPage />
    </RequireAuth>
  ),
},

// Buyer - Pending Orders
{
  path: '/buyer/orders',
  element: (
    <RequireAuth requireBuyer={true}>
      <BuyerOrdersPage />
    </RequireAuth>
  ),
},

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },


    ]
  }
]);


function App() {
  const {
    setSession,
    finishInitializing,
    isInitializing,
  } = useAuthStore();


  useEffect(() => {
    async function restoreSession() {
      try {
        const { data } = await authApi.refreshToken();
        
        // Set the token immediately so the interceptor can attach it to the getProfile request
        useAuthStore.getState().setToken(data.token);

        const { data: profileData } = await authApi.getProfile();

        setSession(
          profileData.user,
          data.token
        );

      } catch {
        finishInitializing();
      }
    }

    restoreSession();
  }, [setSession, finishInitializing]);




  return (
    <div className="min-h-screen w-full">
      <RouterProvider router={router} />
    </div>
  );
}


export default App;