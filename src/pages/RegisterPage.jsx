import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/error-message";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp, googleLogin } = useAuth();

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
      await signUp(form.name.trim(), form.email, form.password);

      toast.success("Account created successfully.");
      navigate("/products", { replace: true });

    } catch (error) {
      toast.error(getErrorMessage(error, "Registration failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await googleLogin();
      toast.success("Signed in with Google.");
      navigate("/products", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Google sign-in failed."));
    }
  };

  return (
    <section className="mx-auto max-w-md" data-testid="register-page">
      <Card className="border-border/60 bg-card/75 shadow-xl shadow-primary/10 backdrop-blur-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-4xl font-bold">Create account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Set up your profile to save products and place orders.
          </p>
        </CardHeader>

        <CardContent>

          {/* GOOGLE REGISTER */}
          <Button
            type="button"
            onClick={handleGoogleRegister}
            variant="outline"
            className="w-full rounded-full mb-4 flex items-center justify-center gap-3 bg-dark-300 text-white-700 border border-dark-300 cursor-pointer"
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your full name"
                required
                minLength={2}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
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
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm password</label>
              <Input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="Repeat your password"
                required
                minLength={6}
              />
            </div>

            <Button
              className="w-full rounded-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>

          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>

        </CardContent>
      </Card>
    </section>
  );
}