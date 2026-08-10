import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { StoreLayout } from './components/Layout/StoreLayout';
import { AdminLayout } from './components/Layout/AdminLayout';

// Guards
import { ProtectedRoute } from './components/guards/ProtectedRoute';
import { AdminRoute } from './components/guards/AdminRoute';

// Pages - Storefront
import { HomePage } from './pages/store/HomePage';
import { ProductsPage } from './pages/store/ProductsPage';
import { ProductDetailPage } from './pages/store/ProductDetailPage';
import { CartPage } from './pages/store/CartPage';
import { CheckoutPage } from './pages/store/CheckoutPage';
import { MyOrdersPage } from './pages/store/MyOrdersPage';
import { OrderDetailPage as StoreOrderDetailPage } from './pages/store/OrderDetailPage';
import { AboutPage } from './pages/store/AboutPage';
import { FaqPage } from './pages/store/FaqPage';
import { SizeGuidePage } from './pages/store/SizeGuidePage';

// Pages - Admin
import { DashboardPage } from './pages/admin/DashboardPage';
import { CategoriesListPage } from './pages/admin/categories/CategoriesListPage';
import { CategoryFormPage } from './pages/admin/categories/CategoryFormPage';
import { ProductsListPage } from './pages/admin/products/ProductsListPage';
import { ProductFormPage } from './pages/admin/products/ProductFormPage';
import { OrdersListPage } from './pages/admin/orders/OrdersListPage';
import { OrderDetailPage as AdminOrderDetailPage } from './pages/admin/orders/OrderDetailPage';
import { UsersListPage } from './pages/admin/users/UsersListPage';
import { UserDetailPage } from './pages/admin/users/UserDetailPage';

// Pages - Auth
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { VerifyOtpPage } from './pages/auth/VerifyOtpPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public Storefront Routes */}
              <Route path="/" element={<StoreLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="faq" element={<FaqPage />} />
                <Route path="size-guide" element={<SizeGuidePage />} />
                
                {/* Protected Customer Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="my-orders" element={<MyOrdersPage />} />
                  <Route path="my-orders/:id" element={<StoreOrderDetailPage />} />
                </Route>
              </Route>

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyOtpPage />} />

              {/* Super Admin Dashboard Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<DashboardPage />} />
                  
                  {/* Category CRUD */}
                  <Route path="categories" element={<CategoriesListPage />} />
                  <Route path="categories/new" element={<CategoryFormPage />} />
                  <Route path="categories/:id" element={<CategoryFormPage />} />
                  
                  {/* Product CRUD */}
                  <Route path="products" element={<ProductsListPage />} />
                  <Route path="products/new" element={<ProductFormPage />} />
                  <Route path="products/:id" element={<ProductFormPage />} />
                  
                  {/* Order CRUD */}
                  <Route path="orders" element={<OrdersListPage />} />
                  <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                  
                  {/* Users CRUD */}
                  <Route path="users" element={<UsersListPage />} />
                  <Route path="users/:id" element={<UserDetailPage />} />
                </Route>
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
