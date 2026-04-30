/** @format */

import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: Props) {
  return (
    <input
      {...props}
      className={`
        w-full px-3 py-2 rounded-md text-sm
        bg-gray-900 text-white
        border border-white/10
        outline-none
        placeholder:text-gray-500
        focus:border-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    />
  );
}
