import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import {
  selectIsAuthChecked,
  selectLoggedInUser,
} from "./features/auth/AuthSlice";

import { Logout } from "./features/auth/components/Logout";
import { Protected } from "./features/auth/components/Protected";
import { useAuthCheck } from "./hooks/useAuth/useAuthCheck";
import { useFetchLoggedInUserDetails } from "./hooks/useAuth/useFetchLoggedInUserDetails";

import {
  AddProductPage,
  AdminOrdersPage,
  AdminProfilePage,
  CartPage,
  CheckoutPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  OrderSuccessPage,
  OtpVerificationPage,
  ProductDetailsPage,
  ProductUpdatePage,
  ResetPasswordPage,
  SignupPage,
  UserOrdersPage,
  UserProfilePage,
  WishlistPage,
} from "./pages";

import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const loggedInUser = useSelector(selectLoggedInUser);

  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser);

  if (!isAuthChecked) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 55%, #fff7ed 100%)",
          color: "#111827",
          fontSize: "20px",
          fontWeight: "800",
          letterSpacing: "-0.02em",
        }}
      >
        Loading Smart Bazaar...
      </div>
    );
  }

  const AdminOnly = ({ children }) => {
    if (!loggedInUser?.isAdmin) {
      return <Navigate to="/" replace />;
    }

    return <Protected>{children}</Protected>;
  };

  const UserOnly = ({ children }) => {
    if (loggedInUser?.isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Protected>{children}</Protected>;
  };

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/reset-password/:userId/:passwordResetToken"
          element={<ResetPasswordPage />}
        />

        {/* Common Protected Routes */}
        <Route
          path="/logout"
          element={
            <Protected>
              <Logout />
            </Protected>
          }
        />

        <Route
          path="/product-details/:id"
          element={
            <Protected>
              <ProductDetailsPage />
            </Protected>
          }
        />

        {/* Root Redirect */}
        <Route
          path="/"
          element={
            loggedInUser?.isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <UserOnly>
                <HomePage />
              </UserOnly>
            )
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminOnly>
              <AdminDashboardPage />
            </AdminOnly>
          }
        />

        <Route
          path="/admin/product-update/:id"
          element={
            <AdminOnly>
              <ProductUpdatePage />
            </AdminOnly>
          }
        />

        <Route
          path="/admin/add-product"
          element={
            <AdminOnly>
              <AddProductPage />
            </AdminOnly>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminOnly>
              <AdminOrdersPage />
            </AdminOnly>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <AdminOnly>
              <AdminProfilePage />
            </AdminOnly>
          }
        />

        {/* User Routes */}
        <Route
          path="/cart"
          element={
            <UserOnly>
              <CartPage />
            </UserOnly>
          }
        />

        <Route
          path="/profile"
          element={
            loggedInUser?.isAdmin ? (
              <AdminOnly>
                <AdminProfilePage />
              </AdminOnly>
            ) : (
              <UserOnly>
                <UserProfilePage />
              </UserOnly>
            )
          }
        />

        <Route
          path="/checkout"
          element={
            <UserOnly>
              <CheckoutPage />
            </UserOnly>
          }
        />

        <Route
          path="/order-success/:id"
          element={
            <UserOnly>
              <OrderSuccessPage />
            </UserOnly>
          }
        />

        <Route
          path="/orders"
          element={
            <UserOnly>
              <UserOrdersPage />
            </UserOnly>
          }
        />

        <Route
          path="/wishlist"
          element={
            <UserOnly>
              <WishlistPage />
            </UserOnly>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={
            loggedInUser?.isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <NotFoundPage />
            )
          }
        />
      </>
    )
  );

  return <RouterProvider router={routes} />;
}

export default App;