/** @format */

import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  /* ============================== */
  /* 🔄 HYDRATE AUTH ON START       */
  /* ============================== */

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  /* ============================== */
  /* ⛔ PREVENT ROUTE FLICKER       */
  /* ============================== */

  if (!isHydrated) {
    return null; // or loader
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
