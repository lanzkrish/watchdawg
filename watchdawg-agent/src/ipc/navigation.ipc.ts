/** @format */

import { ipcMain } from "electron";
import {
  loadConsent,
  loadDashboard,
} from "../windows/window.manager";

export function registerNavigationIPC() {
  ipcMain.on("load-consent", loadConsent);
  ipcMain.on("load-dashboard", loadDashboard);
}
