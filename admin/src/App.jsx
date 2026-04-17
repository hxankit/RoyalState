import { useState } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./lib/utils";

// Context
import { AuthProvider } from "./contexts/AuthContext";

// Components
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import ErrorFallback from "./components/ErrorFallback";

// Pages
import Login from "./components/login";
import Dashboard from "./pages/Dashboard";
import BuilderDashboard from "./pages/BuilderDashboard";
import PropertyListings from "./pages/List";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Appointments from "./pages/Appointments";
import PendingListings from "./pages/PendingListings";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import Builders from "./pages/Builders";
import ActivityLogs from "./pages/ActivityLogs";
import FormQueries from "./pages/FormQueries";

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// Dashboard Wrapper - renders correct dashboard based on user role
const DashboardWrapper = () => {
  const reduxAuth = useSelector(state => state.auth);
  // Get role from user object (preferred) or from role field (fallback)
  const role = reduxAuth?.user?.role || reduxAuth?.role;
  
  if (role === 'builder') {
    return <BuilderDashboard />;
  }
  
  return <Dashboard />;
};

// App Layout component
const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex">
      {/* Sidebar */}
      {!isLoginPage && (
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      )}

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          !isLoginPage && "lg:ml-64", // Default margin for expanded sidebar
          !isLoginPage && isSidebarCollapsed && "lg:ml-20" // Smaller margin for collapsed sidebar
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1"
          >
            <Routes location={location}>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Routes for both superadmin and builder */}
                <Route path="/dashboard" element={<DashboardWrapper />} />
                <Route path="/list" element={<PropertyListings />} />
                <Route path="/add" element={<Add />} />
                <Route path="/update/:id" element={<Update />} />
                <Route path="/appointments" element={<Appointments />} />

                {/* Superadmin-only routes */}
                <Route element={<RoleBasedRoute allowedRoles={['superadmin']} />}>
                  <Route path="/pending-listings" element={<PendingListings />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/:id" element={<UserDetails />} />
                  <Route path="/builders" element={<Builders />} />
                  <Route path="/activity-logs" element={<ActivityLogs />} />
                  <Route path="/form-queries" element={<FormQueries />} />
                </Route>
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <AuthProvider>
        <AppLayout />

        {/* Toast Notifications — Sonner */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'Manrope, sans-serif',
              fontSize: '14px',
            },
          }}
        />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;