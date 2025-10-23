export const getAuthUser = () => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("authUser");
  return data ? JSON.parse(data) : null;
};

export const logoutUser = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authUser");
};
