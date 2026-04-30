export const formatTime = (time: number | string) => {
  const date =
    typeof time === "number"
      ? new Date(time)
      : new Date(time);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
