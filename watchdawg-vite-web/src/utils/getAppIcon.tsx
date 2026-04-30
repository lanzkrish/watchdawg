/** @format */

import {
  Coffee,
  Globe,
  MessageCircle,
  Monitor,
  Music,
  Pause,
  PlayCircle,
} from "lucide-react";

import { FaChrome, FaCode, FaEdge } from "react-icons/fa";
import { SiSlack, SiSpotify, SiWhatsapp, SiYoutube } from "react-icons/si";

export const getAppIcon = (app?: string) => {
  const name = app?.toLowerCase() || "";

  /* ============================== */
  /* 🌐 BROWSERS                    */
  /* ============================== */

  if (name.includes("chrome"))
    return <FaChrome className="text-green-400 text-lg" />;

  if (name.includes("edge"))
    return <FaEdge className="text-blue-400 text-lg" />;

  if (name.includes("browser"))
    return <Globe className="text-blue-400" />;

  /* ============================== */
  /* 💻 DEVELOPMENT                 */
  /* ============================== */

  if (name.includes("code") || name.includes("vscode"))
    return <FaCode className="text-blue-400 text-lg" />;

  /* ============================== */
  /* 💬 COMMUNICATION               */
  /* ============================== */

  if (name.includes("slack"))
    return <SiSlack className="text-purple-400 text-lg" />;

  if (name.includes("whatsapp"))
    return <SiWhatsapp className="text-green-500 text-lg" />;

  if (name.includes("chat"))
    return <MessageCircle className="text-blue-400" />;

  /* ============================== */
  /* 🎵 MEDIA                       */
  /* ============================== */

  if (name.includes("spotify"))
    return <SiSpotify className="text-green-500 text-lg" />;

  if (name.includes("youtube"))
    return <SiYoutube className="text-red-500 text-lg" />;

  if (name.includes("music"))
    return <Music className="text-pink-400" />;

  if (name.includes("video"))
    return <PlayCircle className="text-red-400" />;

  /* ============================== */
  /* 🧠 SYSTEM STATES               */
  /* ============================== */

  if (name.includes("break"))
    return <Coffee className="text-yellow-400" />;

  if (name.includes("idle"))
    return <Pause className="text-yellow-500" />;

  /* ============================== */
  /* 🖥 DEFAULT                     */
  /* ============================== */

  return <Monitor className="text-gray-400" />;
};
