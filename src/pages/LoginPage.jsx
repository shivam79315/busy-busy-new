import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuth } from "../lib/auth-context";
import { getErrorMessage } from "../lib/error-message";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromPath = location.state?.from || "/products";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await login(form);
      toast.success("Welcome back.");
      navigate(fromPath, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md" data-testid="login-page">
      <Card className="border-border/60 bg-card/75 shadow-xl shadow-primary/10 backdrop-blur-md" data-testid="login-card">
        <CardHeader className="space-y-2">
          <CardTitle className="text-4xl font-bold text-foreground" data-testid="login-title">Login</CardTitle>
          <p className="text-sm text-muted-foreground" data-testid="login-subtitle">Access your cart, wishlist, and order history.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="login-email" data-testid="login-email-label">Email</label>
              <Input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="you@example.com"
                required
                data-testid="login-email-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="login-password" data-testid="login-password-label">Password</label>
              <Input
                id="login-password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Enter your password"
                required
                minLength={6}
                data-testid="login-password-input"
              />
            </div>

            <Button className="w-full rounded-full" type="submit" disabled={isSubmitting} data-testid="login-submit-button">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground" data-testid="login-register-prompt">
            New here?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline" data-testid="login-register-link">
              Create account
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
