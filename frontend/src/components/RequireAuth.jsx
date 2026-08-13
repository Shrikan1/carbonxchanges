import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Wraps any route that needs a logged-in user. Since App.jsx already
// resolves isInitializing (the one-time session-restore attempt) before
// rendering <Routes> at all, by the time this ever runs we already know
// for certain whether the user is authenticated — no loading flicker here.
export default function RequireAuth({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}