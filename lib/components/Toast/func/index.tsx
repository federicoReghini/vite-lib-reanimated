import { DeviceEventEmitter } from "react-native";
import { ToastProps } from "../index.tsx";

export const toast = {
  success: ({ message, status, duration }: ToastProps) => {
    DeviceEventEmitter.emit("showToast", {
      message,
      status,
      duration,
      type: "success",
    });
  },
  error: ({ message, status, duration }: ToastProps) => {
    DeviceEventEmitter.emit("showToast", {
      message,
      status,
      duration,
      type: "error",
    });
  },

  warning: ({ message, status, duration }: ToastProps) => {
    DeviceEventEmitter.emit("showToast", {
      message,
      status,
      duration,
      type: "warning",
    });
  },
};
