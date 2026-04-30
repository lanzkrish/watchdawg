/** @format */

import {
  clearUser,
  loadUser,
  saveUser,
  UserData,
} from "./authStore";

/* ============================== */
/* 🧠 STATE                       */
/* ============================== */

type AuthState = {
  userId: string | null;
  organizationId: string | null;
  token: string | null;
};

let authState: AuthState = {
  userId: null,
  organizationId: null,
  token: null,
};

let isInitialized = false;

/* ============================== */
/* 🔄 INIT                        */
/* ============================== */

export function initAuth() {
  const saved = loadUser();

  if (saved) {
    authState = {
      userId: saved.userId,
      organizationId: saved.organizationId,
      token: saved.token, // ✅ FIX
    };

    console.log("🔐 Auth restored:", saved.userId);
  } else {
    console.log("⚠️ No saved auth");
  }

  isInitialized = true;
}

/* ============================== */
/* 🔐 SET AUTH                    */
/* ============================== */

export function setAuth(
  userId: string,
  organizationId: string,
  token: string
) {
  if (!userId || !organizationId || !token) {
    throw new Error("❌ Invalid auth data");
  }

  const data: UserData = {
    userId,
    organizationId,
    token,
  };

  authState = {
    userId,
    organizationId,
    token,
  };

  saveUser(data);

  console.log("✅ Auth set:", userId);
}

/* ============================== */
/* 🔍 GET AUTH                    */
/* ============================== */

export function getAuth(): AuthState {
  return authState;
}

/* ============================== */
/* 🔑 GET TOKEN                   */
/* ============================== */

export function getToken(): string | null {
  return authState.token;
}

/* ============================== */
/* ❗ REQUIRE AUTH                */
/* ============================== */

export function requireAuth(): UserData {
  if (!isInitialized) {
    throw new Error("❌ Auth not initialized");
  }

  if (
    !authState.userId ||
    !authState.organizationId ||
    !authState.token
  ) {
    throw new Error("❌ Auth required");
  }

  return {
    userId: authState.userId,
    organizationId: authState.organizationId,
    token: authState.token,
  };
}

/* ============================== */
/* 🚪 LOGOUT                      */
/* ============================== */

export function logout() {
  authState = {
    userId: null,
    organizationId: null,
    token: null, // ✅ FIX
  };

  clearUser();

  console.log("🚪 Logged out");
}
