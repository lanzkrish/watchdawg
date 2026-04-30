/** @format */

export type FormData = {
  companyName: string;
  industry: string;
  companySize: string;
  fullName: string;
  email: string;
  password: string;
  workHours: string;
  trackingMode: string;
  idleTime: string;
  screenshots: boolean;
  appTracking: boolean;
};

export type FormChangeHandler = <K extends keyof FormData>(key: K, value: FormData[K]) => void;
