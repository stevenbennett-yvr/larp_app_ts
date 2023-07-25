import { Navigate } from 'react-router-dom';
import { useAuth } from "./contexts/AuthContext";

// For use in App.tsx, restircts users from accessing the the app unless logged in.

export default function PrivateRoute({ children }: any): JSX.Element {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}