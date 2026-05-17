export const getRole = () => localStorage.getItem("role");

export const isAdmin = () => getRole() === "admin";

export const isUser = () => getRole() === "user";

export const isAuth = () => !!localStorage.getItem("token");