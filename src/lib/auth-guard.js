import { toast } from "sonner";
import { getErrorMessage } from "./error-message";

export async function withAuthGuard({
  isAuthenticated,
  navigate,
  redirectTo,
  callback,
  fallbackErrorMessage
}) {
  if (!isAuthenticated) {
    toast.error("Please login to continue.");
    navigate("/login", { state: { from: redirectTo } });
    return;
  }

  try {
    await callback();
  } catch (error) {
    toast.error(getErrorMessage(error, fallbackErrorMessage));
  }
}