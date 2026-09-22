import { useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "./AuthModal";

interface ProtectedRouteProps {
  children: ReactNode;
  featureName: string;
}

function ProtectedRoute({ children, featureName }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    navigate("/sip-calculator", { replace: true });
  }, [navigate]);

  const handleSuccess = useCallback(() => {
    // AuthContext now has a session; this component re-renders `children`.
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="auth-gate">
        <div className="auth-gate-backdrop" aria-hidden="true" />
        <AuthModal
          isOpen
          featureName={featureName}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
