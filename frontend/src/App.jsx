import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "./context/AuthContext";
import AppLayout from "./components/layout/AppLayout";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const BoardPage = lazy(() => import("./pages/BoardPage"));
const Settings = lazy(() => import("./pages/Settings"));
const Placeholder = lazy(() => import("./pages/Placeholder"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

function FullScreenLoader() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-9 h-9 rounded-full border-2 border-line border-t-accent animate-spin" />
    </div>
  );
}

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  return user ? <Navigate to="/" replace /> : children;
}

const Page = ({ children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}>{children}</motion.div>
);

export default function App() {
  const location = useLocation();
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<PublicOnly><Page><Login /></Page></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Page><Register /></Page></PublicOnly>} />
          <Route path="/forgot-password" element={<PublicOnly><Page><ForgotPassword /></Page></PublicOnly>} />

          <Route element={<Protected><AppLayout /></Protected>}>
            <Route path="/" element={<Page><Dashboard /></Page>} />
            <Route path="/board" element={<Page><BoardPage /></Page>} />
            <Route path="/favorites" element={<Page><Placeholder title="Favorite" /></Page>} />
            <Route path="/recent" element={<Page><Placeholder title="Recently open" /></Page>} />
            <Route path="/archive" element={<Page><Placeholder title="Archive" /></Page>} />
            <Route path="/settings" element={<Page><Settings /></Page>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
