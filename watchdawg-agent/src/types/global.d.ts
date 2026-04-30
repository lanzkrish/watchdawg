/* ============================== */
/* 🌍 GLOBAL TYPES (V5 PRO)       */
/* ============================== */

export { };

/* ============================== */
/* 🧠 ENUMS (STRICT CONTROL)      */
/* ============================== */

type ActivityCategory = "productive" | "neutral" | "distracting";

type ActivityStatus = "active" | "idle" | "away";

type ActivitySource = "agent" | "extension";

/* ============================== */
/* 📦 EXTENSION DATA TYPE         */
/* ============================== */

interface ExtensionData {
  userId: string;
  organizationId: string;

  app: string;           // always Browser from extension
  platform?: string;     // YouTube, Spotify
  category?: ActivityCategory;

  title?: string;
  domain?: string;

  status?: ActivityStatus;

  source: ActivitySource;

  timestamp: number;
}

/* ============================== */
/* 🔐 AUTH STATE TYPE             */
/* ============================== */

interface AuthState {
  userId: string | null;
  organizationId: string | null;
}

/* ============================== */
/* 🌐 GLOBAL DECLARATION          */
/* ============================== */

declare global {
  var extensionData: ExtensionData | null;
  var authState: AuthState;
}
