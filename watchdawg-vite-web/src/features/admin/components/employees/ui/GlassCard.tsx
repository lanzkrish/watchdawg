/** @format */

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function GlassCard({ children, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`
        rounded-xl border border-white/10
        bg-white/5 backdrop-blur-md
        p-5
        ${className || ""}
      `}
    >
      {children}
    </motion.div>
  );
}
