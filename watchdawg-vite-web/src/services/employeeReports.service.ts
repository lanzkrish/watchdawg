/** @format */

import { api } from "./api";

/* ============================== */
/* 📊 OVERVIEW (MAIN REPORT PAGE) */
/* ============================== */

export const getOverview = async () => {
  try {
    const res = await api.get("/employee/reports/overview");
    return res.data;
  } catch (err: any) {
    console.error("❌ Overview Error:", err?.message);
    return null;
  }
};

/* ============================== */
/* 📅 REPORT LIST (FOR DOWNLOAD UI) */
/* ============================== */

export const getMyReports = async () => {
  try {
    const res = await api.get("/employee/reports");
    return res.data || [];
  } catch (err: any) {
    console.error("❌ Reports Error:", err?.message);
    return [];
  }
};

/* ============================== */
/* ⬇️ DOWNLOAD CSV (PRODUCTION++) */
/* ============================== */

export const downloadReport = async (
  date: string,
  type: "daily" | "weekly" | "monthly" = "daily"
) => {
  try {
    /* ============================== */
    /* 🔥 ENDPOINT RESOLUTION         */
    /* ============================== */

    const endpoint =
      type === "daily"
        ? `/employee/reports/${date}`
        : `/employee/reports/${type}/${date}`;

    const res = await api.get(endpoint, {
      responseType: "blob",
    });

    /* ============================== */
    /* 📥 CREATE BLOB                 */
    /* ============================== */

    const blob = new Blob([res.data], {
      type: res.headers["content-type"] || "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    /* ============================== */
    /* 📂 FILENAME (SMART)            */
    /* ============================== */

    const contentDisposition = res.headers["content-disposition"];

    let filename = `${type}-report-${date}.csv`;

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match?.[1]) filename = match[1];
    }

    /* ============================== */
    /* 🔥 TRIGGER DOWNLOAD            */
    /* ============================== */

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    /* ============================== */
    /* 🧹 CLEANUP                     */
    /* ============================== */

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (err: any) {
    console.error("❌ Download Error:", err?.message);

    // 🔥 optional UI integration later
    throw err;
  }
};
