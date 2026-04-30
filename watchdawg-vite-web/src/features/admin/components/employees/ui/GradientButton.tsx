/** @format */

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function GradientButton({
  children,
  onClick,
  disabled = false,
  className = "",
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full py-2 rounded-md font-medium
        overflow-hidden
        transition active:scale-[0.98]
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {/* Gradient background */}
      <span
        className="
          absolute inset-0
          bg-gradient-to-r from-green-400 to-emerald-500
          transition group-hover:opacity-90
        "
      />

      {/* Content */}
      <span className="relative text-black text-sm font-semibold">
        {children}
      </span>
    </button>
  );
}
