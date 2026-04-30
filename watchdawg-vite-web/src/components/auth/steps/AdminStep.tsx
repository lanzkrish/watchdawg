/** @format */

import type { FormData, FormChangeHandler } from "@/types/auth";

interface Props {
  formData: FormData;
  onChange: FormChangeHandler;
}

export default function AdminStep({ formData, onChange }: Props) {
  return (
    <div className='space-y-4'>
      {/* Full Name */}
      <input value={formData.fullName} onChange={(e) => onChange("fullName", e.target.value)} placeholder='Full Name' className='w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition' />

      {/* Email */}
      <input type='email' value={formData.email} onChange={(e) => onChange("email", e.target.value)} placeholder='Work Email' className='w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition' />

      {/* Password */}
      <input type='password' value={formData.password} onChange={(e) => onChange("password", e.target.value)} placeholder='Password' className='w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition' />
    </div>
  );
}
