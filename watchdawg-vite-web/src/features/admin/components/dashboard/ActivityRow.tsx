export default function ActivityRow({ item }: any) {
  const statusStyles = {
    active: "bg-green-500/20 text-green-400",
    idle: "bg-yellow-500/20 text-yellow-400",
    away: "bg-red-500/20 text-red-400",
  };

  return (
    <div
      className={`
        flex items-center justify-between gap-4
        px-5 py-4 rounded-xl border transition-all duration-300

        ${
          item.status === "active"
            ? "bg-green-500/5 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.08)]"
            : item.status === "idle"
            ? "bg-yellow-500/5 border-yellow-500/20"
            : "bg-red-500/5 border-red-500/20"
        }
      `}
    >
      {/* 🔥 LEFT: USER + APP */}
      <div className="flex items-center gap-4">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">
          {item.name?.charAt(0) || "U"}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* 👤 NAME */}
          <p className="text-sm font-semibold text-white">
            {item.name || "Unknown User"}
          </p>

          {/* 💻 APP */}
          <p className="text-xs text-gray-400">
            {item.app}
          </p>

          {/* 🌐 TITLE */}
          <p className="text-[11px] text-gray-500 truncate max-w-[250px]">
            {item.title}
          </p>
        </div>
      </div>

      {/* 🔹 PLATFORM */}
      <span className="text-xs text-gray-400 hidden md:block">
        {item.platform}
      </span>

      {/* 🔥 STATUS BADGE */}
      <span
        className={`
          text-xs px-3 py-1 rounded-full font-medium capitalize
          ${statusStyles[item.status] || "bg-gray-500/20 text-gray-400"}
        `}
      >
        {item.status}
      </span>
    </div>
  );
}
