/** @format */

export const getStatusColor = (status: string) => {
  if (status === "active") return "text-green-400";
  if (status === "idle") return "text-yellow-400";
  return "text-red-400";
};

export const getStatusDot = (status: string) => {
  if (status === "active") return "bg-green-400";
  if (status === "idle") return "bg-yellow-400";
  return "bg-red-400";
};
