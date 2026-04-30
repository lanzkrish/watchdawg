// useGlobalTicker.ts
import { useActivityStore } from "@/store/activity.store";
import { useEffect } from "react";

export const useGlobalTicker = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      useActivityStore.getState().tick();
    }, 1000);

    return () => clearInterval(interval);
  }, []);
};
