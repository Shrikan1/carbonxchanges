import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Wraps any route that needs a logged-in user. Since App.jsx already
// resolves isInitializing (the one-time session-restore attempt) before
// rendering <Routes> at all, by the time this ever runs we already know
// for certain whether the user is authenticated — no loading flicker here.
export default function RequireAuth({ 
  children, 
  allowedRoles, 
  requireSeller, 
  requireBuyer 
}) {
  const { user, isAuthenticated, isInitializing } = useAuthStore();
  
  if (isInitializing) return <div className="min-h-screen w-full bg-[#0c0c0c]"></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Role check
  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/dashboard" replace />;
  }

  // Capability checks
  if (requireSeller && !user?.is_seller) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireBuyer && !user?.is_buyer) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}