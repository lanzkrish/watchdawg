/** @format */

export default function FolderHeader({
  name,
  count,
  onClick,
}: any) {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-white/5"
    >
      <div className="flex items-center gap-3">
        <span>📂</span>
        <span className="text-white font-medium">{name}</span>
      </div>

      <span className="text-xs text-gray-400">
        {count} employees
      </span>
    </div>
  );
}
