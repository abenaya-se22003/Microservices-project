import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  var { user } = useAuth();
  var location = useLocation();

  // If user is not authenticated, redirect to login page and pass the current location in state
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children (the protected page) if authenticated
  return children;
}

export default ProtectedRoute;
