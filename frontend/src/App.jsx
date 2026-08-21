import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';

import Home from './pages/shared/Home';
import AuthPage from './pages/auth/AuthPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import About from './pages/shared/About';
import Contact from './pages/shared/Contact';
import Article from './pages/shared/Article';
import Posts from './pages/shared/Posts';
import PostDetail from './pages/shared/PostDetail';

import ProjectListPage from './pages/seller/ProjectListPage';
import ProjectFormPage from './pages/seller/ProjectFormPage';
import SellerProjectDetailPage from './pages/seller/SellerProjectDetailPage';

import RequireAuth from './components/RequireAuth';
import ProfilePage from './pages/shared/ProfilePage';

import { useAuthStore } from './store/useAuthStore';
import * as authApi from './api/endpoint/Authapi';


import PublicProjectShowcasePage from './pages/shared/PublicProjectShowcasePage';
import MarketplaceDetailPage from './pages/shared/MarketplaceDetailPage';
import ProjectPostEditorPage from './pages/seller/ProjectPostEditorPage';
import ProjectVerificationPage from './pages/seller/ProjectVerificationPage';
import CreditsPage from './pages/seller/CreditsPage';
import ListingsPage from './pages/seller/ListingsPage';
import SalesPage from './pages/seller/SalesPage';
import SellerWalletPage from './pages/seller/SellerWalletPage';

import WalletPage from './pages/shared/WalletPage';
import DashboardPage from './pages/shared/DashboardPage';
import MarketplacePage from './pages/shared/MarketplacePage';

import AdminReviewQueuePage from './pages/admin/AdminReviewQueuePage';
import AdminProjectDetailPage from './pages/admin/AdminProjectDetailPage';
import AdminAgentsPage from './pages/admin/AdminAgentsPage';
import AdminMintQueuePage from './pages/admin/AdminMintQueuePage';
import AdminOversightUsersPage from './pages/admin/AdminOversightUsersPage';
import AdminOversightProjectsPage from './pages/admin/AdminOversightProjectsPage';
import AdminOversightTransactionsPage from './pages/admin/AdminOversightTransactionsPage';
import AdminReversalsPage from './pages/admin/AdminReversalsPage';

import AgentAssignedProjectsPage from './pages/agent/AgentAssignedProjectsPage';
import AgentProjectDetailPage from './pages/agent/AgentProjectDetailPage';
import AgentHistoryPage from './pages/agent/AgentHistoryPage';

import NotFoundPage from './pages/shared/NotFoundPage';

import { Toaster } from 'react-hot-toast';

const RootLayout = () => (
  <>
    <ScrollRestoration />
    <Toaster position="top-center" reverseOrder={false} />
    <Outlet />
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