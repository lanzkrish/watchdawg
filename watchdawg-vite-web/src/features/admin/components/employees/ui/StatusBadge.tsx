/** @format */

type Status = "active" | "idle" | "away" | "inactive";

type Props = {
  status: Status;
};

export default function StatusBadge({ status }: Props) {
  const styles: Record<Status, string> = {
    active: "text-green-400 bg-green-400/10",
    idle: "text-yellow-400 bg-yellow-400/10",
    away: "text-red-400 bg-red-400/10",
    inactive: "text-gray-400 bg-gray-400/10",
  };

  const label =
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2 py-1 rounded-md text-xs font-medium
        ${styles[status]}
      `}
    >
      <span className="w-2 h-2 rounded-full bg-current" />
      {label}
    </span>
  );
}
