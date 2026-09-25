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
  
  if (isInitializing) return (
    <div className="min-h-screen w-full bg-[#f4f7f5] relative">
      <div className="absolute top-0 left-0 w-full h-1 overflow-hidden bg-gray-200">
        <div className="h-full bg-[#173d25] w-1/3 animate-[pulse_1s_ease-in-out_infinite]" />
      </div>
    </div>
  );
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