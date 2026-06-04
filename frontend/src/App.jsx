import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/shared/NavBar";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { MyOrdersPage } from "./pages/account/MyOrdersPage";
import { ProfilePage } from "./pages/account/ProfilePage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { ProductDetailPage } from "./pages/storefront/ProductDetailPage";
import { StorefrontPage } from "./pages/storefront/StorefrontPage";
import "./styles/theme.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<StorefrontPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/account/profile" element={<ProfilePage />} />
              <Route path="/account/orders" element={<MyOrdersPage />} />
            </Route>
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin/products" element={<AdminProductsPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
