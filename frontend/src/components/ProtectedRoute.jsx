import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    // ignore
  }

  if (!token) return <Navigate to="/auth" replace />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
