/** @format */

import type { FormData, FormChangeHandler } from "@/types/auth";

interface Props {
  formData: FormData;
  onChange: FormChangeHandler;
}

export default function WorkStep({ formData, onChange }: Props) {
  return (
    <div className='space-y-4'>
      {/* Working Hours */}
      <input value={formData.workHours} onChange={(e) => onChange("workHours", e.target.value)} placeholder='Working Hours (e.g. 9 AM - 6 PM)' className='w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition' />

      {/* Tracking Mode */}
      <select value={formData.trackingMode} onChange={(e) => onChange("trackingMode", e.target.value)} className='w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition'>
        <option value=''>Tracking Mode</option>
        <option value='strict'>Strict</option>
        <option value='moderate'>Moderate</option>
        <option value='minimal'>Minimal</option>
      </select>
    </div>
  );
}
