import { useState } from "react";


export function Toggle({ label }: { label: string }) {
  const [on, setOn] = useState(false);

  return (
    <div className='flex justify-between items-center'>
      <span>{label}</span>

      <button
        onClick={() => setOn(!on)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          on ? "bg-green-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full transition ${
            on ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}
