import toast from "react-hot-toast";

export const useToastMessage = () => {
  const success = (message: string) =>
    toast.success(message, {
      icon: "✅",
      style: {
        background: "#16a34a", // Tailwind's green-600
        color: "#fff",
      },
    });

  const failure = (message: string) =>
    toast.error(message, {
      icon: "🛑",
      style: {
        background: "#b91c1c", // red-700
        color: "#fff",
      },
    });

  const warning = (message: string) =>
    toast(message, {
      icon: "⚠️",
      style: {
        background: "#f59e0b", // amber-500
        color: "#000",
      },
    });

  const info = (message: string) =>
    toast(message, {
      icon: "💬",
      style: {
        background: "#2563eb", // blue-600
        color: "#fff",
      },
    });

  return { success, failure, warning, info };
};
