import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { isAdminEmail } from "../lib/admin";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const allowed = isAuthenticated && isAdminEmail(user?.email);

  useEffect(() => {
    if (!loading && !allowed) {
      toast.error("Admins only.");
    }
  }, [loading, allowed]);

  if (loading) {
    return (
      <section className="rounded-3xl border border-border/60 bg-card/70 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Checking admin access...
        </p>
      </section>
    );
  }

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
