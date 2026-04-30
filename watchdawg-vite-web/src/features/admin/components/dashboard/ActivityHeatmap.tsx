/** @format */

interface HeatmapItem {
  hour: number; // 0–23
  value: number; // intensity (0–100)
}

interface Props {
  data: HeatmapItem[];
}

/* ============================== */
/* 🎨 COLOR SCALE                 */
/* ============================== */

const getColor = (value: number) => {
  if (value > 70) return "bg-green-400";
  if (value > 40) return "bg-yellow-400";
  if (value > 10) return "bg-orange-400";
  return "bg-red-400";
};

/* ============================== */
/* 🧩 COMPONENT                   */
/* ============================== */

export default function ActivityHeatmap({ data }: Props) {
  return (
    <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h3 className="text-white font-semibold">
          Productivity Heatmap
        </h3>

        <span className="text-xs text-gray-400">
          Today
        </span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-12 gap-2">

        {data.map((item, i) => (
          <div
            key={i}
            className={`
              h-8 rounded-md
              ${getColor(item.value)}
              hover:scale-110 transition
            `}
            title={`Hour ${item.hour}: ${item.value}%`}
          />
        ))}

      </div>

      {/* LEGEND */}
      <div className="flex justify-between mt-4 text-xs text-gray-400">
        <span>Low</span>
        <span>High</span>
      </div>

    </div>
  );
}
