/** @format */

export default function TaskHeader() {
  return (
    <div className="flex justify-between items-center">

      <div>
        <h1 className="text-2xl font-semibold text-white">
          Tasks
        </h1>

        <p className="text-sm text-gray-400">
          Tasks assigned by your manager
        </p>
      </div>

      {/* 🔥 Progress Summary */}
      <div className="text-sm text-gray-400">
        1/3 • 33%
      </div>

    </div>
  );
}
