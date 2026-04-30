/** @format */

export const state = {
  lastApp: null as string | null,

  /* 🔥 STATUS ENGINE */
  status: "active" as "active" | "idle" | "away",

  lastActivityTime: Date.now(), // 🔥 last user interaction
  idleStartTime: 0,             // when idle started

  /* 🎵 MUSIC ENGINE */
  music: {
    app: null as string | null,
    startTime: 0,
    total: 0,
  },
};
