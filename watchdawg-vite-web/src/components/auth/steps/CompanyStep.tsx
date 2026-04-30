/** @format */

import type { FormData, FormChangeHandler } from "@/types/auth";

interface Props {
  formData: FormData;
  onChange: FormChangeHandler;
}

export default function CompanyStep({ formData, onChange }: Props) {
  return (
    <div className='space-y-4'>
      {/* Company Name */}
      <input value={formData.companyName} onChange={(e) => onChange("companyName", e.target.value)} placeholder='Company Name' className='w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition' />

      {/* Industry */}
      <input value={formData.industry} onChange={(e) => onChange("industry", e.target.value)} placeholder='Industry' className='w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition' />

      {/* Company Size */}
      <select value={formData.companySize} onChange={(e) => onChange("companySize", e.target.value)} className='w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition'>
        <option value=''>Company Size</option>
        <option value='1-10'>1-10</option>
        <option value='10-50'>10-50</option>
        <option value='50-200'>50-200</option>
        <option value='200+'>200+</option>
      </select>
    </div>
  );
}
