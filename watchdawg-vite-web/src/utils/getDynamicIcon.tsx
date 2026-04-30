/** @format */

import { Icons } from "@/components/icons";
import React from "react";
import {
  siGithub,
  siGooglechrome,
  siNotion,
  siSpotify,
  siYoutube,
} from "simple-icons";

/* ============================== */
/* 🎨 BRAND SVG COMPONENT         */
/* ============================== */

type BrandIconProps = {
  path: string;
  color: string;
};

const BrandIcon: React.FC<BrandIconProps> = ({ path, color }) => {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill={color}>
      <path d={path} />
    </svg>
  );
};

/* ============================== */
/* 🌐 GET FAVICON                 */
/* ============================== */

const getFavicon = (domain?: string): string | null => {
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
};

/* ============================== */
/* 🎨 STATUS COLOR HELPER         */
/* ============================== */

function getStatusColor(status?: string) {
  if (status === "active") return "text-green-400";
  if (status === "idle") return "text-yellow-400";
  if (status === "away") return "text-red-400";
  return "text-gray-400";
}

/* ============================== */
/* 🚀 MAIN ICON FUNCTION          */
/* ============================== */

export function getDynamicIcon(
  app?: string,
  platform?: string,
  domain?: string,
  status?: "active" | "idle" | "away"
): React.ReactNode {
  const name = (platform || app || "").toLowerCase();

  /* ============================== */
  /* ☕ BREAK / IDLE / AWAY         */
  /* ============================== */

  if (status === "idle" || status === "away") {
    return (
      <Icons.Coffee
        size={18}
        className={getStatusColor(status)}
      />
    );
  }

  /* ============================== */
  /* 🌐 DOMAIN ICON (PRIMARY)       */
  /* ============================== */

  if (domain) {
    const src = getFavicon(domain);

    return (
      <img
        src={src || ""}
        alt="icon"
        className="w-5 h-5 rounded"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  /* ============================== */
  /* 🎵 MEDIA                       */
  /* ============================== */

  if (name.includes("spotify")) {
    return <BrandIcon path={siSpotify.path} color="#1DB954" />;
  }

  if (name.includes("youtube")) {
    return <BrandIcon path={siYoutube.path} color="#FF0000" />;
  }

  /* ============================== */
  /* 💻 DEV                        */
  /* ============================== */

  if (name.includes("github")) {
    return <BrandIcon path={siGithub.path} color="#ffffff" />;
  }

  if (name.includes("code")) {
    return <Icons.Code size={18} />;
  }

  /* ============================== */
  /* 🌐 BROWSER                    */
  /* ============================== */

  if (name.includes("chrome")) {
    return <BrandIcon path={siGooglechrome.path} color="#4285F4" />;
  }

  if (name.includes("edge")) {
    return <Icons.Globe size={18} color="#0EA5E9" />;
  }

  /* ============================== */
  /* 📄 DOCS                       */
  /* ============================== */

  if (name.includes("notion")) {
    return <BrandIcon path={siNotion.path} color="#ffffff" />;
  }

  if (name.includes("docs")) {
    return <Icons.FileText size={18} />;
  }

  /* ============================== */
  /* 🌍 DEFAULT                    */
  /* ============================== */

  return <Icons.Globe size={18} />;
}
