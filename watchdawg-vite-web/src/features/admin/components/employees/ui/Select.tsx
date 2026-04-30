/** @format */

import type { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className = "", children, ...props }: Props) {
  return (
    <select
      {...props}
      className={`
        w-full px-3 py-2 rounded-md text-sm
        bg-gray-900 text-white
        border border-white/10
        outline-none
        focus:border-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </select>
  );
}
