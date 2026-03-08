import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuth } from "../lib/auth-context";
import { getErrorMessage } from "../lib/error-message";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name: form.name.trim(), email: form.email, password: form.password });
      toast.success("Account created successfully.");
      navigate("/products", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Registration failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md" data-testid="register-page">
      <Card className="border-border/60 bg-card/75 shadow-xl shadow-primary/10 backdrop-blur-md" data-testid="register-card">
        <CardHeader className="space-y-2">
          <CardTitle className="text-4xl font-bold text-foreground" data-testid="register-title">Create account</CardTitle>
          <p className="text-sm text-muted-foreground" data-testid="register-subtitle">Set up your profile to save products and place orders.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="register-name" data-testid="register-name-label">Name</label>
              <Input
                id="register-name"
                type="text"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Your full name"
                required
                minLength={2}
                data-testid="register-name-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="register-email" data-testid="register-email-label">Email</label>
              <Input
                id="register-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="you@example.com"
                required
                data-testid="register-email-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="register-password" data-testid="register-password-label">Password</label>
              <Input
                id="register-password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                data-testid="register-password-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="register-confirm-password" data-testid="register-confirm-password-label">Confirm password</label>
              <Input
                id="register-confirm-password"
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                placeholder="Repeat your password"
                required
                minLength={6}
                data-testid="register-confirm-password-input"
              />
            </div>

            <Button className="w-full rounded-full" type="submit" disabled={isSubmitting} data-testid="register-submit-button">
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground" data-testid="register-login-prompt">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline" data-testid="register-login-link">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
