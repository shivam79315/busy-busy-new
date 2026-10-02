import { Route, Routes } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminHeroPage from "@/pages/admin/AdminHeroPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";

const AdminRoutes = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="hero" element={<AdminHeroPage />} />
      <Route path="products" element={<AdminProductsPage />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
