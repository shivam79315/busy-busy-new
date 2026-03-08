import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { Toaster } from "sonner";
import Navbar from "./components/layout/Navbar";
import { AuthProvider, useAuth } from "./lib/auth-context";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import RegisterPage from "./pages/RegisterPage";
import WishlistPage from "./pages/WishlistPage";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <section className="rounded-3xl border border-border/60 bg-card/70 p-8 text-center" data-testid="app-loading-state">
        <p className="text-sm text-muted-foreground" data-testid="app-loading-text">Loading your shopping space...</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/products/:productId" element={<ProductDetailPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/cart"
      element={(
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/wishlist"
      element={(
        <ProtectedRoute>
          <WishlistPage />
        </ProtectedRoute>
      )}
    />
    <Route
      path="/orders"
      element={(
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      )}
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-super-grad min-h-screen" data-testid="store-app-shell">
          <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
          <Navbar />
          <main className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 md:px-10 md:pt-28" data-testid="app-main-content">
            <AppRoutes />
          </main>
          <Footer />
          <Toaster richColors position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;