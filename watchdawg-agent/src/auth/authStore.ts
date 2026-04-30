/** @format */

import fs from "fs";
import path from "path";

/* ============================== */
/* 🧠 TYPES                       */
/* ============================== */

export type UserData = {
  userId: string;
  organizationId: string;
  token:string;
};

/* ============================== */
/* 📁 FILE PATH                   */
/* ============================== */

const FILE = path.join(__dirname, "../../storage/user.json");

/* ============================== */
/* 💾 SAVE USER                   */
/* ============================== */

export function saveUser(data: UserData) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

  console.log("User saved with token");
}

/* ============================== */
/* 📥 LOAD USER (SYNC)            */
/* ============================== */

export function loadUser(): UserData | null {
  try {
    if (!fs.existsSync(FILE)) return null;

    const raw = fs.readFileSync(FILE, "utf-8");

    const parsed = JSON.parse(raw);

    // 🔒 validate structure
    if (
      typeof parsed.userId === "string" &&
      typeof parsed.organizationId === "string"&&
      typeof parsed.token==="string"
    ) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

/* ============================== */
/* 🧹 CLEAR USER                  */
/* ============================== */

export function clearUser() {
  if (fs.existsSync(FILE)) {
    fs.unlinkSync(FILE);
  }
}
