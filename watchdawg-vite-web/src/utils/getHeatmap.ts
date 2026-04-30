/** @format */

export function generateHeatmap(live: any[]) {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: 0,
  }));

  live.forEach((item) => {
    const hour = new Date(item.timestamp).getHours();

    if (!hours[hour]) return;

    if (item.status === "active") {
      hours[hour].value += 10;
    } else if (item.status === "idle") {
      hours[hour].value += 5;
    } else {
      hours[hour].value += 2;
    }
  });

  return hours;
}
