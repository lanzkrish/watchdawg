export function ReportCard({ title }: { title: string }) {
  return (
    <div className="
      bg-gray-900 border border-white/10 rounded-xl p-5
      flex justify-between items-center
      hover:border-blue-500/30 transition
    ">

      <div className="flex items-center gap-3">

        {/* ICON */}
        <div className="
          w-10 h-10 rounded-lg
          bg-blue-500/20 flex items-center justify-center
        ">
          📊
        </div>

        <div>
          <p className="text-white text-sm font-medium">
            {title}
          </p>
          <p className="text-gray-500 text-xs">
            CSV / PDF / JSON
          </p>
        </div>

      </div>

      <button className="
        px-3 py-1.5 text-xs rounded-md
        bg-gradient-to-r from-blue-500 to-cyan-500
        text-white
      ">
        Download
      </button>

    </div>
  );
}
