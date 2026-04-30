/** @format */

import { useEffect, useRef, useState } from "react";

interface Props {
  baseDuration: number;
  lastUpdated:number;
  size?: "sm" | "md" | "lg";
}

/* ============================== */
/* 🎨 SIZE CONFIG                 */
/* ============================== */

const sizeMap = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
};

/* ============================== */
/* 🧩 COMPONENT                   */
/* ============================== */

export default function LiveTimer({
  baseDuration,
  size = "md",
}: Props) {
  const [time, setTime] = useState<number>(baseDuration);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ============================== */
  /* 🔥 SYNC WITH STORE            */
  /* ============================== */

  useEffect(() => {
    setTime(baseDuration);
  }, [baseDuration]);

  /* ============================== */
  /* 🚀 LOCAL UI TICKER            */
  /* ============================== */

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /* ============================== */
  /* 🧠 FORMAT TIME                */
  /* ============================== */

  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = time % 60;

  const formatted =
    h > 0
      ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  /* ============================== */
  /* 🎯 RENDER                     */
  /* ============================== */

  return (
    <div className="flex flex-col items-end leading-none">

      {/* TIMER */}
      <span
        className={`
          font-mono tracking-widest
          ${sizeMap[size]}
          text-white
          tabular-nums
        `}
      >
        {formatted}
      </span>

      {/* MICRO LABEL */}
      <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
        live
      </span>

    </div>
  );
}
