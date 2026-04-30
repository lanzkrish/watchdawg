/** @format */

import type { FormData, FormChangeHandler } from "@/types/auth";

interface Props {
  formData: FormData;
  onChange: FormChangeHandler;
}

export default function SecurityStep({ formData, onChange }: Props) {
  return (
    <div className='space-y-5'>
      {/* Enable Screenshots */}
      <label className='flex items-center justify-between bg-gray-800 p-3 rounded-lg'>
        <span>Enable Screenshots</span>
        <input type='checkbox' checked={formData.screenshots} onChange={(e) => onChange("screenshots", e.target.checked)} className='accent-blue-500' />
      </label>

      {/* App Tracking */}
      <label className='flex items-center justify-between bg-gray-800 p-3 rounded-lg'>
        <span>App Tracking</span>
        <input type='checkbox' checked={formData.appTracking} onChange={(e) => onChange("appTracking", e.target.checked)} className='accent-blue-500' />
      </label>

      {/* Idle Time */}
      <input value={formData.idleTime} onChange={(e) => onChange("idleTime", e.target.value)} placeholder='Idle Time (minutes)' className='w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition' />
    </div>
  );
}
