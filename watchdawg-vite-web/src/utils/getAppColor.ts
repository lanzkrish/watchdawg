/** @format */

/**
 * Returns Tailwind color class based on app name
 */
export const getAppColor = (app: string): string => {
  const name = app?.toLowerCase();

  switch (name) {
    case "chrome":
      return "text-green-400";

    case "vs code":
    case "vscode":
      return "text-blue-400";

    case "slack":
      return "text-purple-400";

    case "break":
      return "text-yellow-400";

    case "idle":
      return "text-yellow-500";

    default:
      return "text-gray-400";
  }
};
