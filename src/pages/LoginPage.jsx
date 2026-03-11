import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/error-message";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, googleLogin } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromPath = location.state?.from || "/products";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login(form.email, form.password);

      toast.success("Welcome back.");
      navigate(fromPath, { replace: true });

    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success("Signed in with Google.");
      navigate(fromPath, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Google login failed."));
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <Card className="border-border/60 bg-card/75 shadow-xl shadow-primary/10 backdrop-blur-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-4xl font-bold text-foreground">
            Login
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Access your cart, wishlist, and order history.
          </p>
        </CardHeader>

        <CardContent>

          {/* GOOGLE LOGIN */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full rounded-full mb-4 flex items-center justify-center gap-3 bg-dark-300 text-white-700 border border-dark-300 cursor-pointer"
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>

          {/* OR DIVIDER */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px bg-border flex-1" />
          </div>

          {/* EMAIL LOGIN */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="login-email">
                Email
              </label>

              <Input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="login-password">
                Password
              </label>

              <Input
                id="login-password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            <Button
              className="w-full rounded-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Create account
            </Link>
          </p>

        </CardContent>
      </Card>
    </section>
  );
}