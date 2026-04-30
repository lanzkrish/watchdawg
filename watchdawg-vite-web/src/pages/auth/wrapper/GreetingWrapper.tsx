/** @format */

import { useLocation } from "react-router-dom";
import Greeting from "../Greeting";

/* 🔥 Define role type */
type Role = "admin" | "employee" | "superadmin";

/* 🔥 Define state type */
interface LocationState {
  type?: "login" | "register";
  role?: Role;
}

export default function GreetingWrapper() {
  const location = useLocation();

  const state = (location.state || {}) as LocationState;

  // 🔥 Safe role fallback
  const storedRole = localStorage.getItem("role");

  const role: Role = state.role || (storedRole === "admin" || storedRole === "employee" || storedRole === "superadmin" ? storedRole : "admin"); // default fallback

  const type: "login" | "register" = state.type || "login";

  return <Greeting type={type} role={role} />;
}
