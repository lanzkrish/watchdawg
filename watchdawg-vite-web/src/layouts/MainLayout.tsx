/** @format */

import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";

import { disconnectSocket, initSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/auth.store";

import { useGlobalTicker } from "@/hooks/useGlobalTicker";
import { useRealtime } from "@/hooks/useRealtime";

import Sidebar from "../components/sidebar/Sidebar";

type Role = "admin" | "employee" | "superadmin";

interface Props {
  role?: Role;
}

export default function MainLayout({ role = "admin" }: Props) {
  const { user, token, isHydrated } = useAuthStore();

  const prevUserRef = useRef<string | null>(null);
  const socketReadyRef = useRef(false);

  /* ============================== */
  /* 🔥 AUTH READY                  */
  /* ============================== */

  const orgId = user?.organizationId;
  const userId = user?.id;
  const userRole = user?.role;

  const isAuthReady =
    isHydrated && !!orgId && !!userId && !!token;

  /* ============================== */
  /* 🔌 SOCKET INIT FIRST           */
  /* ============================== */

  useEffect(() => {
    if (!isAuthReady) return;

    /* 🔄 USER SWITCH */
    if (prevUserRef.current && prevUserRef.current !== userId) {
      console.log("🔄 User changed → resetting socket");
      disconnectSocket();
      socketReadyRef.current = false;
    }

    prevUserRef.current = userId!;

    /* 🚀 INIT SOCKET */
    console.log("🚀 Initializing socket");

    initSocket({
      orgId: orgId!,
      userId: userId!,
      role: userRole!,
      token,
    });

    socketReadyRef.current = true;
  }, [isAuthReady, orgId, userId, userRole, token]);

  /* ============================== */
  /* 🔥 REALTIME + TICKER (AFTER)   */
  /* ============================== */

  useRealtime();
  useGlobalTicker();

  /* ============================== */
  /* ⏳ BLOCK UNTIL HYDRATED        */
  /* ============================== */

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ============================== */
  /* 🚀 UI                          */
  /* ============================== */

  return (
    <div className="flex bg-gray-950 text-white min-h-screen">
      <Sidebar role={role} />

      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
