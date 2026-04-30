// /** @format */

// import { getSocket } from "@/lib/socket";
// import { useAuthStore } from "@/store/auth.store";

// export const useEmitActivity = () => {
//   const { user } = useAuthStore();

//   const sendActivity = (app: string, status: string) => {
//     if (!user) return;

//     const payload = {
//       userId: user.id,
//       organizationId: user.organizationId,
//       app,
//       status,
//       time: new Date(),
//     };

//     getSocket.emit("employee_activity", payload);

//     console.log("📡 Sent:", payload);
//   };

//   return { sendActivity };
// };
