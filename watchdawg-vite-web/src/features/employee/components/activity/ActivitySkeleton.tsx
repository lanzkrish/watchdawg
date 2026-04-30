/** @format */

export default function ActivitySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="h-7 w-40 bg-gray-700/40 rounded-md" />
        <div className="h-6 w-28 bg-gray-700/40 rounded-full" />
      </div>

      {/* LIST */}
      <div className="space-y-3">

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="
              flex items-center justify-between
              px-5 py-4 rounded-xl
              bg-[#0f172a]
              border border-gray-800
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-4 min-w-[260px]">

              {/* ICON */}
              <div className="w-10 h-10 rounded-lg bg-gray-700/40" />

              {/* TEXT */}
              <div className="space-y-2">
                <div className="h-3 w-28 bg-gray-700/40 rounded" />
                <div className="h-2 w-40 bg-gray-700/30 rounded" />
              </div>
            </div>

            {/* CENTER */}
            <div className="flex items-center gap-3">

              <div className="h-6 w-20 bg-gray-700/40 rounded-full" />
              <div className="h-6 w-24 bg-gray-700/30 rounded-full" />

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-6">
              <div className="h-3 w-12 bg-gray-700/30 rounded" />
              <div className="h-4 w-10 bg-gray-700/40 rounded" />
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
