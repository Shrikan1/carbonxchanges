import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/shared/Home';
import AuthPage from './pages/auth/AuthPage';
import VerifyEmail from './pages/auth/VerifyEmail';
import About from './pages/shared/About';
import Contact from './pages/shared/Contact';
import Article from './pages/shared/Article';
import Posts from './pages/shared/Posts';

import ProjectListPage from './pages/seller/ProjectListPage';
import ProjectFormPage from './pages/seller/ProjectFormPage';

import RequireAuth from './components/RequireAuth';
import ProfilePage from './pages/shared/ProfilePage';

import { useAuthStore } from './store/useAuthStore';
import * as authApi from './api/endpoint/Authapi';


import PublicProjectShowcasePage from './pages/shared/PublicProjectShowcasePage';
import ProjectPostEditorPage from './pages/seller/ProjectPostEditorPage';
import ProjectVerificationPage from './pages/seller/ProjectVerificationPage';
import CreditsPage from './pages/seller/CreditsPage';
import ListingsPage from './pages/seller/ListingsPage';
import SalesPage from './pages/seller/SalesPage';

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

const router = createBrowserRouter([
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
      <RequireAuth>
        <ProjectListPage />
      </RequireAuth>
    ),
  },

  // Create New Project
  {
    path: '/seller/projects/new',
    element: (
      <RequireAuth>
        <ProjectFormPage />
      </RequireAuth>
    ),
  },

  {
    path: '/projects/:projectId',
    element: <PublicProjectShowcasePage />,
  },

  // Seller project editor
  {
    path: '/seller/projects/:projectId/post',
    element: (
      <RequireAuth>
        <ProjectPostEditorPage />
      </RequireAuth>
    ),
  },
  {
    path: '/seller/post/new',
    element: (
      <RequireAuth>
        <ProjectPostEditorPage />
      </RequireAuth>
    ),
  },
  {
  path: '/seller/projects/:projectId/verification',
  element: (
    <RequireAuth>
      <ProjectVerificationPage />
    </RequireAuth>
  ),
},

{
  path: '/seller/credits',
  element: (
    <RequireAuth>
      <CreditsPage />
    </RequireAuth>
  ),
},

{
  path: '/seller/listings',
  element: (
    <RequireAuth>
      <ListingsPage />
    </RequireAuth>
  ),
},

{
  path: '/seller/sales',
  element: (
    <RequireAuth>
      <SalesPage />
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
    <RequireAuth>
      <AdminReviewQueuePage />
    </RequireAuth>
  ),
},

// Admin - Project Detail
{
  path: '/admin/projects/:id',
  element: (
    <RequireAuth>
      <AdminProjectDetailPage />
    </RequireAuth>
  ),
},

// Admin - Agents
{
  path: '/admin/agents',
  element: (
    <RequireAuth>
      <AdminAgentsPage />
    </RequireAuth>
  ),
},

// Admin - Mint Queue
{
  path: '/admin/mint-queue',
  element: (
    <RequireAuth>
      <AdminMintQueuePage />
    </RequireAuth>
  ),
},

// Admin - Oversight Users
{
  path: '/admin/oversight/users',
  element: (
    <RequireAuth>
      <AdminOversightUsersPage />
    </RequireAuth>
  ),
},

// Admin - Oversight Projects
{
  path: '/admin/oversight/projects',
  element: (
    <RequireAuth>
      <AdminOversightProjectsPage />
    </RequireAuth>
  ),
},

// Admin - Oversight Transactions
{
  path: '/admin/oversight/transactions',
  element: (
    <RequireAuth>
      <AdminOversightTransactionsPage />
    </RequireAuth>
  ),
},

// Admin - Reversals
{
  path: '/admin/reversals',
  element: (
    <RequireAuth>
      <AdminReversalsPage />
    </RequireAuth>
  ),
},
// Agent - Assigned Projects
{
  path: '/agent/projects',
  element: (
    <RequireAuth>
      <AgentAssignedProjectsPage />
    </RequireAuth>
  ),
},

// Agent - Project Detail
{
  path: '/agent/projects/:id',
  element: (
    <RequireAuth>
      <AgentProjectDetailPage />
    </RequireAuth>
  ),
},

// Agent - History
{
  path: '/agent/history',
  element: (
    <RequireAuth>
      <AgentHistoryPage />
    </RequireAuth>
  ),
},
  // 404
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          404 — Page Not Found
        </h1>
      </div>
    ),
  },


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

        const { data: profileData } =
          await authApi.getProfile();

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