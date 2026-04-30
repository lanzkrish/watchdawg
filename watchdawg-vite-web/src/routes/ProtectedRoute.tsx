/** @format */

import { useAuthStore } from "@/store/auth.store";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  roles?: ("admin" | "employee" | "superadmin")[]; // ✅ multiple roles support
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { token, user, isHydrated } = useAuthStore();

  /* ============================== */
  /* ⛔ WAIT FOR HYDRATION          */
  /* ============================== */

  if (!isHydrated) {
    return null; // or loader
  }

  /* ============================== */
  /* ❌ NOT LOGGED IN               */
  /* ============================== */

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  /* ============================== */
  /* ❌ USER NOT READY              */
  /* ============================== */

  if (!user) {
    return null; // prevent false redirect
  }

  /* ============================== */
  /* 🔐 ROLE CHECK                  */
  /* ============================== */

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  /* ============================== */
  /* ✅ ACCESS GRANTED              */
  /* ============================== */

  return <>{children}</>;
}
