import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ProductsPage from "@/pages/ProductsPage";
import RegisterPage from "@/pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import CartPage from "@/pages/CartPage";
import WishlistPage from "@/pages/WishlistPage";
import OrdersPage from "@/pages/OrdersPage";
import { Navigate, Route, Routes } from "react-router-dom";

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

export default AppRoutes;