/** @format */

import { clearUser, loadUser, saveUser } from "../auth/authStore";
import { loadConsent, loadLogin } from "../windows/window.manager";

/* ============================== */
/* 🧠 TYPES                       */
/* ============================== */

type AuthState = {
  userId: string | null;
  orgId: string | null;
  token: string | null;
};

/* ============================== */
/* 🧠 RUNTIME STATE               */
/* ============================== */

const state: AuthState = {
  userId: null,
  orgId: null,
  token: null,
};

/* ============================== */
/* 🔐 SET AUTH                    */
/* ============================== */

export function setAuth(
  userId: string,
  orgId: string,
  token: string
) {
  if (!userId || !orgId || !token) {
    console.warn("⚠️ Invalid auth data");
    return;
  }

  state.userId = userId;
  state.orgId = orgId;
  state.token = token;

  /* 🔥 Persist to file */
  saveUser({
    userId,
    organizationId: orgId,
    token,
  });

  console.log("🔐 Auth set + persisted:", userId);
}

/* ============================== */
/* 📥 GET AUTH                    */
/* ============================== */

export function getAuth(): AuthState {
  return state;
}

/* ============================== */
/* 🔑 GET TOKEN                   */
/* ============================== */

export function getToken(): string | null {
  return state.token;
}

/* ============================== */
/* 🛑 CLEAR AUTH                  */
/* ============================== */

export function clearAuth() {
  clearUser();

  state.userId = null;
  state.orgId = null;
  state.token = null;

  console.log("🧹 Auth cleared");
}

/* ============================== */
/* 🔄 RESTORE SESSION             */
/* ============================== */

export function restoreSession() {
  const user = loadUser();

  if (!user) {
    console.log("⚠️ No saved session");
    loadLogin();
    return;
  }

  /* 🔥 Validate */
  if (!user.userId || !user.organizationId || !user.token) {
    console.warn("⚠️ Corrupted session → clearing");

    clearAuth();
    loadLogin();
    return;
  }

  /* 🔥 Restore */
  state.userId = user.userId;
  state.orgId = user.organizationId;
  state.token = user.token;

  console.log("🔐 Session restored with token");

  loadConsent();
}
